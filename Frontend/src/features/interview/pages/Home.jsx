import React, { useState, useRef, useEffect } from "react";
import "../style/home.scss"
import { useInterview } from "../hooks/useInterview"
import { useNavigate } from 'react-router'

export default function Home() {

    const navigate = useNavigate();

    const { loading, generateReport, reports, getReports } = useInterview();

    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const resumeInputRef = useRef();

    

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current?.files?.[0];

        if (!resumeFile || !jobDescription.trim() || !selfDescription.trim()) {
            alert("Please upload your resume and fill in both descriptions.");
            return;
        }

        try {
            const data = await generateReport({
                jobDescription,
                selfDescription,
                resumeFile
            });

            if (data?._id) {
                navigate(`/interview/${data._id}`);
            }
        } catch (error) {
            console.error("Failed to generate report:", error);
        }
    }

    return (
        <>
            {/* Main Card */}
            <main className="home">

                <header className="home-intro">
                    <span className="home-intro__eyebrow">Create Your Custom Interview Prep</span>
                    <h1>Make your next interview count</h1>
                    <p>Bring the job description, self description and your latest resume together. We’ll help you prepare with a focused interview report.</p>

                </header>
                <div className="left">
                    <textarea name="jobDescription" id="jobDescription" placeholder="Enter job description here..."
                        onChange={(e) => setJobDescription(e.target.value)}
                    >
                    </textarea>
                </div>
                <div className="right">
                    <div className="input-group">
                        <label htmlFor="resume">Upload your current resume here</label>
                        <input ref={resumeInputRef} type="file" name="resume" id="resume" accept=".pdf" />
                    </div>

                    <div className="input-group">
                        <label htmlFor="self Description">Self Description</label>
                        <textarea name="selfDescription" id="selfDescription" placeholder="Describe yourself in a few sentences..."
                            onChange={(e) => setSelfDescription(e.target.value)}
                        ></textarea>
                    </div>

                    <button className="button"
                        onClick={handleGenerateReport}
                    >
                        Generate Interview Report
                    </button>
                </div>
                <div className="recent-reports">
                    {/* Report List */}
                    {reports?.length > 0 && (
                        <section className="recent-list">
                            <h2>My Recent Interview Plans</h2>

                            <ul className="reports-list">
                                {reports.map((report) => (
                                    <li
                                        key={report._id}
                                        className="report-item"
                                        onClick={() => navigate(`/interview/${report._id}`)}
                                    >
                                        <h3>{report.title}</h3>

                                        <p className="report-date">
                                            Generated on{" "}
                                            {new Date(report.createdAt).toLocaleDateString()}
                                        </p>
                                        <p className={`matchScore`}>{report.matchScore}% Match</p>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            </main>


        </>
    )
}
