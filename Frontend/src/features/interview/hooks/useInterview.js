import { getAllInterviewReports, getInterviewReportById, generateInterviewReport, generateResumePdf, deleteInterviewReportById } from "../services/interview.api"
import { useContext, useEffect } from 'react';
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router";

export const useInterview = () => {
    const context = useContext(InterviewContext);
    const { interviewId } = useParams();

    if (!context) {
        throw new Error("useInterview must be within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        let response = null;
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
        } catch (error) {
            alert(error.response?.data?.message || "Failed to generate report. Please try again.")
            console.log(error)
        } finally {
            setLoading(false);
        }
        return response.interviewReport;
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null;
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
        return response.interviewReport;
    }

    const deleteReportById = async (interviewId) => {
        try {
            await deleteInterviewReportById(interviewId)
            setReports((currentReports) => currentReports.filter((item) => item._id !== interviewId))
            return true
        } catch (error) {
            alert(error.response?.data?.message || "Failed to delete report. Please try again.")
            console.error("Failed to delete report:", error)
            return false
        }
    }

    const getReports = async () => {
        setLoading(true)
        try {
            const response = await getAllInterviewReports()
            setReports(response.interviewReports ?? []);
        } catch (error) {
            setReports([]);
        } finally {
            setLoading(false);
        }
    }

    const getResumePdf = async (interviewId) => {
        setLoading(true);
        try {
            const pdfBlob = await generateResumePdf({ interviewId });
            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `resume_${interviewId}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("PDF download failed:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (interviewId) getReportById(interviewId);
        else getReports();
    }, [interviewId]);

    return { loading, report, reports, getReportById, getReports, generateReport, getResumePdf, deleteReportById }
}
