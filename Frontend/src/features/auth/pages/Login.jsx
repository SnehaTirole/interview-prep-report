import React, { useState } from "react";
import '../auth.form.scss'
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import Loader from "../../common/components/Loader";

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await handleLogin({ email, password });
            navigate("/")
        }catch(err){
            console.error("Login failed:", err.response?.data || err.message);
            navigate("/login")
        }
        

    }
    if (loading) {
        return (<main><Loader /></main>)
    }

    return (
        <>
            <main >
                <div className="form-container">
                    <h1>Login</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                onChange={(e) => { setEmail(e.target.value) }}
                                type="email" name="email" id="email" placeholder="Enter email address" />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                onChange={(e) => { setPassword(e.target.value) }}
                                type="password" name="password" id="password" placeholder="Enter password" />
                        </div>

                        <button className="button primary-button" >Login</button>
                    </form>

                    <p>Don't have an account?<Link to={"/register"}>Register</Link></p>
                </div>
            </main>
        </>
    )
}

export default Login;