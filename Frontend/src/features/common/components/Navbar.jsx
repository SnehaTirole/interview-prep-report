import React from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";
import "../style/navbar.scss";

export default function Navbar() {
    const { user, loading, handleLogout } = useAuth();
    const navigate = useNavigate();

    const onLogout = async () => {
        try {
            await handleLogout();
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Could not log out:", error);
        }
    };

    return (
        <header className="site-header">
            <nav className="site-nav" aria-label="Main navigation">
                <Link className="site-nav__brand" to={user ? "/" : "/login"}>
                    Interview Prep
                </Link>

                <div className="site-nav__actions">
                    {user ? (
                        <>
                            <span className="site-nav__welcome">
                                Welcome, <strong>{user.username || user.name || "User"}</strong>
                            </span>
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
