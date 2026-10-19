import React from "react";
import { Link } from "react-router";
import "../style/front.scss";

const features = [
    {
        number: "01",
        title: "Role-focused questions",
        description: "Practice technical and behavioral questions shaped around the role you want."
    },
    {
        number: "02",
        title: "A clearer picture of your fit",
        description: "See how your experience lines up with the job description and where to focus next."
    },
    {
        number: "03",
        title: "A practical preparation plan",
        description: "Get a structured roadmap to help you prepare one step at a time."
    }
];

export default function Front() {
    return (
        <main className="front-page">
            <section className="front-hero">
                <div className="front-hero__copy">
                    <span className="front-eyebrow">Your next opportunity starts here</span>
                    <h1>Walk into your next interview <em>prepared.</em></h1>
                    <p>
                        Turn your resume and a job description into focused questions,
                        useful feedback, and a preparation plan built around you.
                    </p>
                    <div className="front-hero__actions">
                        <Link className="front-button front-button--primary" to="/register">
                            Get started
                        </Link>
                        <Link className="front-button front-button--secondary" to="/login">
                            I already have an account
                        </Link>
                    </div>
                    <span className="front-hero__note">A focused way to prepare for what comes next.</span>
                </div>

                <div className="front-preview" aria-label="Interview preparation preview">
                    <div className="front-preview__topline">
                        <span className="front-preview__dot" />
                        <span>YOUR PREPARATION PLAN</span>
                        <span className="front-preview__status">READY</span>
                    </div>
                    <div className="front-preview__score">
                        <div className="front-preview__ring"><span>84<small>%</small></span></div>
                        <div>
                            <span className="front-preview__label">ROLE MATCH</span>
                            <strong>A strong starting point</strong>
                            <p>Build confidence with a focused plan.</p>
                        </div>
                    </div>
                    <div className="front-preview__divider" />
                    <span className="front-preview__label">YOUR PLAN INCLUDES</span>
                    <ul>
                        <li><span>01</span> Technical questions</li>
                        <li><span>02</span> Behavioral practice</li>
                        <li><span>03</span> A step-by-step roadmap</li>
                    </ul>
                </div>
            </section>

            <section className="front-features" aria-labelledby="front-features-title">
                <div className="front-section-heading">
                    <span className="front-eyebrow">Prepare with purpose</span>
                    <h2 id="front-features-title">Everything you need to feel ready</h2>
                    <p>Make your preparation specific, organized, and easier to act on.</p>
                </div>
                <div className="front-feature-grid">
                    {features.map((feature) => (
                        <article className="front-feature" key={feature.number}>
                            <span className="front-feature__number">{feature.number}</span>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="front-cta">
                <div>
                    <span className="front-eyebrow">Start preparing today</span>
                    <h2>Your next interview deserves your best preparation.</h2>
                </div>
                <Link className="front-button front-button--primary" to="/register">Create your free account</Link>
            </section>
        </main>
    );
}
