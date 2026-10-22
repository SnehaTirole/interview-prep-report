import React from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";
import "../style/navbar.scss";

export default function Navbar() {
    const { user, loading, handleLogout,setUser } = useAuth();
    const navigate = useNavigate();

    const onLogout = async () => {
        try {
            await handleLogout();
            setUser(null); // Clear the user state after logout
            navigate("/", { replace: true });
        } catch (error) {
            console.error("Could not log out:", error);
        }
    };

    const onReportsClick = () => {
        navigate("/");
        window.requestAnimationFrame(() => {
            document.getElementById("reports")?.scrollIntoView({ behavior: "smooth" });
        });
    };

    return (
        <header className="site-header">
            <nav className="site-nav" aria-label="Main navigation">
                <Link className="site-nav__brand" to={user ? "/" : "/login"}>
                    InterviewPrep
                </Link>

                <div className="site-nav__actions">
                    {user ? (
                        <>
                            <span className="site-nav__welcome">
                                Welcome, <strong>{user.username || user.name || "User"}</strong>
                            </span>

                            <Link className="site-nav__home" to="/">Home</Link>
                            <button className="site-nav__reports" type="button" onClick={onReportsClick}>Reports</button>
                            <button
                                className="site-nav__logout"
                                type="button"
                                onClick={onLogout}
                                disabled={loading}
                            >
                            


                                {loading ? "Logging out…" : "Log out"}
                            </button>
                            
                        </>
                    ) : loading ? (
                        <span className="site-nav__welcome" role="status">Loading account…</span>
                    ) : (
                        <>
                            
                            <Link className="site-nav__link" to="/login">Log in</Link>
                            <Link className="site-nav__register" to="/register">Create account</Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}
