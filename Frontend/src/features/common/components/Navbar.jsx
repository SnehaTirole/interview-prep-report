import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";
import "../style/navbar.scss";

export default function Navbar() {
    const { user, loading, handleLogout, setUser } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    const onLogout = async () => {
        try {
            await handleLogout();
            setUser(null);
            closeMenu();
            navigate("/", { replace: true });
        } catch (error) {
            console.error("Could not log out:", error);
        }
    };

    const onReportsClick = () => {
        closeMenu();
        navigate("/");
        window.requestAnimationFrame(() => {
            document.getElementById("reports")?.scrollIntoView({ behavior: "smooth" });
        });
    };

    return (
        <header className="site-header">
            <nav className="site-nav" aria-label="Main navigation">
                <Link className="site-nav__brand" to={user ? "/" : "/login"} onClick={closeMenu}>
                    InterviewPrep
                </Link>

                <button
                    className="site-nav__toggle"
                    type="button"
                    aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={menuOpen}
                    aria-controls="site-nav-actions"
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    <span />
                    <span />
                    <span />
                </button>

                <div id="site-nav-actions" className={`site-nav__actions${menuOpen ? " is-open" : ""}`}>
                    {user ? (
                        <>
                            <span className="site-nav__welcome">
                                Welcome, <strong>{user.username || user.name || "User"}</strong>
                            </span>
                            <Link className="site-nav__home" to="/" onClick={closeMenu}>Home</Link>
                            <button className="site-nav__reports" type="button" onClick={onReportsClick}>Reports</button>
                            <button className="site-nav__logout" type="button" onClick={onLogout} disabled={loading}>
                                {loading ? "Logging out..." : "Log out"}
                            </button>
                        </>
                    ) : loading ? (
                        <span className="site-nav__welcome" role="status">Loading account...</span>
                    ) : (
                        <>
                            <Link className="site-nav__link" to="/login" onClick={closeMenu}>Log in</Link>
                            <Link className="site-nav__register" to="/register" onClick={closeMenu}>Create account</Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}

