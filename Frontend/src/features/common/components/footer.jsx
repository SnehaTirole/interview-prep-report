import React from "react";
import { Link } from "react-router";
import "../style/footer.scss";

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="site-footer__inner">
                <Link className="site-footer__brand" to="/">Interview Prep</Link>
                <p>Prepare with purpose. Show up with confidence.</p>
                
                <span className="site-footer__copyright">
                    © {new Date().getFullYear()} InterviewPrep
                </span>
            </div>
        </footer>
    );
}
