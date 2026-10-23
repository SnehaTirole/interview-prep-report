import React, { useState, useRef } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router";

export default function Home() {
    const navigate = useNavigate();
    const { loading, generateReport, reports, deleteReportById } = useInterview();
    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const resumeInputRef = useRef();

    const handleDeleteReport = async (event, reportId) => {
        event.stopPropagation();
        if (!window.confirm("Delete this interview report? This action cannot be undone.")) return;
        await deleteReportById(reportId);
    };

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current?.files?.[0];
        if (!resumeFile || !jobDescription.trim() || !selfDescription.trim()) {
            alert("Please upload your resume and fill in both descriptions.");
            return;
        }
        try {
            const data = await generateReport({ jobDescription, selfDescription, resumeFile });
            if (data?._id) navigate(`/interview/${data._id}`);
        } catch (error) {
            console.error("Failed to generate report:", error);
        }
    };

    return (
        <main className="home">
            <header className="home-intro">
                <span className="home-intro__eyebrow">Create Your Custom Interview Prep</span>
                <h1>Make your next interview count</h1>
                <p>Bring the job description, self description and your latest resume together. We&rsquo;ll help you prepare with a focused interview report.</p>
            </header>
            <div className="left">
                <textarea name="jobDescription" id="jobDescription" placeholder="Enter job description here..." onChange={(e) => setJobDescription(e.target.value)} />
            </div>
            <div className="right">
                <div className="input-group">
                    <label htmlFor="resume">Upload your current resume here</label>
                    <input ref={resumeInputRef} type="file" name="resume" id="resume" accept=".pdf" />
                </div>
                <div className="input-group">
                    <label htmlFor="selfDescription">Self Description</label>
                    <textarea name="selfDescription" id="selfDescription" placeholder="Describe yourself in a few sentences..." onChange={(e) => setSelfDescription(e.target.value)} />
                </div>
                <button className="button" onClick={handleGenerateReport} disabled={loading}>
                    Generate Interview Report
                </button>
            </div>
            <div className="recent-reports" id="reports">
                <section className="recent-list" aria-labelledby="recent-reports-heading">
                    <h2 id="recent-reports-heading">My Recent Interview Plans</h2>
                    {reports?.length > 0 ? (
                        <ul className="reports-list">
                            {reports.map((report) => (
                                <li key={report._id} className="report-item" onClick={() => navigate(`/interview/${report._id}`)}>
                                    <button
                                        className="report-delete"
                                        type="button"
                                        aria-label={`Delete report: ${report.title}`}
                                        title="Delete report"
                                        onClick={(event) => handleDeleteReport(event, report._id)}
                                    >
                                        &times;
                                    </button>
                                    <h3>{report.title}</h3>
                                    <p className="report-date">Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                    <p className="matchScore">{report.matchScore}% Match</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="reports-empty">No interview reports yet. Generate one to see it here.</p>
                    )}
                </section>
            </div>
        </main>
    );
}



