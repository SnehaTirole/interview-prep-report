const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


//Zod tells your application whether Gemini actually generated valid data.
const interviewReportSchema = z.object({
    matchScore: z.number()
        .describe("A score between 0 and 100 indicating how well the candidate's resume and profile match the job description"),

    technicalQuestions: z.array(
        z.object({
            question: z.string()
                .describe("A technical question that may be asked in the interview"),
            intention: z.string()
                .describe("The interviewer's intention behind asking this technical question"),
            answer: z.string()
                .describe("Guidance on how the candidate should answer the question, including important points to cover and the recommended approach")
        })
    ).describe("Technical interview questions relevant to the candidate's resume and the job description"),

    behavioralQuestions: z.array(
        z.object({
            question: z.string()
                .describe("A behavioral question that may be asked in the interview"),
            intention: z.string()
                .describe("The interviewer's intention behind asking this behavioral question"),
            answer: z.string()
                .describe("Guidance on how the candidate should answer this question, including important points to cover and the recommended approach")
        })
    ).describe("Behavioral interview questions relevant to the candidate's background and the job description"),

    skillGaps: z.array(
        z.object({
            skill: z.string()
                .describe("A skill required by the job description that is missing or insufficiently demonstrated in the candidate's resume"),
            severity: z.enum(["low", "medium", "high"])
                .describe("How important this missing skill is for the job")
        })
    ).describe("Skills that the candidate should improve based on the job description"),

    preparationPlan: z.array(
        z.object({
            day: z.number()
                .describe("The day number of the preparation plan, starting from 1"),
            focus: z.string()
                .describe("The main topic or area to focus on during this day"),
            tasks: z.array(z.string())
                .describe("Specific tasks the candidate should complete on this day")
        })
    ).describe("A day-wise interview preparation plan"),

    title: z.string()
        .describe("The job role or position for which this interview report is generated")
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `
            You are an expert technical interviewer and career coach.

            Analyze the candidate's resume, self-description, and job description.

            Generate an interview preparation report.

            IMPORTANT:
            - Return ONLY valid JSON.
            - Do NOT return Markdown.
            - Do NOT return JSON inside a string.
            - Do NOT return arrays containing strings.
            - Every item inside technicalQuestions MUST be an object and between 5 and 15 questions.
            - Every item inside behavioralQuestions MUST be an object and between 5 and 15 questions.
            - Every item inside skillGaps MUST be an object.
            - Every item inside preparationPlan MUST be an object and make plan depend on the skill gap.
            - Follow the exact JSON structure defined by the response schema.

            CANDIDATE RESUME:
            ${resume}

            CANDIDATE SELF DESCRIPTION:
            ${selfDescription}

            JOB DESCRIPTION:
            ${jobDescription}`;

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",

        contents: prompt,

        config: {
            responseMimeType: "application/json",

            //responseSchema tells Gemini what to generate
            responseSchema: {
                type: "object",

                properties: {
                    matchScore: {
                        type: "number",
                        description:
                            "A score between 0 and 100 indicating how well the candidate matches the job description"
                    },

                    technicalQuestions: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                question: {
                                    type: "string"
                                },
                                intention: {
                                    type: "string"
                                },
                                answer: {
                                    type: "string"
                                }
                            },
                            required: [
                                "question",
                                "intention",
                                "answer"
                            ]
                        }
                    },

                    behavioralQuestions: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                question: {
                                    type: "string"
                                },
                                intention: {
                                    type: "string"
                                },
                                answer: {
                                    type: "string"
                                }
                            },
                            required: [
                                "question",
                                "intention",
                                "answer"
                            ]
                        }
                    },

                    skillGaps: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                skill: {
                                    type: "string"
                                },
                                severity: {
                                    type: "string",
                                    enum: [
                                        "low",
                                        "medium",
                                        "high"
                                    ]
                                }
                            },
                            required: [
                                "skill",
                                "severity"
                            ]
                        }
                    },

                    preparationPlan: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                day: {
                                    type: "number"
                                },
                                focus: {
                                    type: "string"
                                },
                                tasks: {
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                }
                            },
                            required: [
                                "day",
                                "focus",
                                "tasks"
                            ]
                        }
                    },

                    title: {
                        type: "string"
                    }
                },

                required: [
                    "matchScore",
                    "technicalQuestions",
                    "behavioralQuestions",
                    "skillGaps",
                    "preparationPlan",
                    "title"
                ]
            }
        }
    });

    const result = JSON.parse(response.text);


    // Validate Gemini result using Zod
    const validatedResult = interviewReportSchema.parse(result);

    return validatedResult;
}

async function generatePdfFromHtml(htmlContent) {
    if (!htmlContent || !htmlContent.trim()) {
        throw new Error("HTML content is empty");
    }

    const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
});

    try {
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({ format: "A4" });
        await browser.close();

        return pdfBuffer;
    }finally {
        await browser.close();
    }
    

}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted into PDF format using libraries like Puppeteer.")
    })

    const prompt = `
            Create a high-quality, professional, ATS-friendly resume tailored to the target job description.

            Existing Resume: ${resume}
            Self Description: ${selfDescription}
            Job Description: ${jobDescription}

            Highlight relevant skills, projects, education, and achievements using strong action verbs and relevant job keywords. Improve grammar and clarity without inventing facts or unsupported skills.

            Design a modern, elegant, single-column HTML resume with clean typography, balanced spacing both vertically and horizontally, subtle professional colors, and clearly defined sections.

            IMPORTANT LAYOUT REQUIREMENTS:
            - Make the resume content evenly distributed across the entire A4 page, from top to bottom.
            - Use the available page space effectively with balanced margins, section spacing, and line heights.
            - Avoid excessive empty space at the bottom or overcrowding at the top.
            - Keep all content readable and visually balanced without unnecessarily shrinking text.
            - Fit the resume on exactly one A4 page whenever the available content reasonably permits.
            - Include embedded CSS and print styles for reliable Puppeteer PDF conversion.
            - Avoid external resources, complex layouts, tables, and decorative graphics.

            Return only a valid JSON object with a single key "html" containing the complete, self-contained HTML5 document. Follow the response schema exactly.
            `;

    const reponse = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema)
        }
    })
    const jsonContent = JSON.parse(reponse.text);
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
   
    return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf }
