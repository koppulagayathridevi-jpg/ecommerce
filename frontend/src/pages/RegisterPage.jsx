import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const RegisterPage = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {

        e.preventDefault();

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/api/register/",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        username: username,
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            console.log("Status:", response.status);
            console.log("Register response:", data);

            if (response.ok) {

                console.log("Registration successful");

                setUsername("");
                setEmail("");
                setPassword("");

                navigate("/login");

            } else {

                console.log("Registration failed:", data);

            }

        } catch (error) {

            console.log("Error:", error);

        }
    };


    return (

        <div style={styles.page}>

            <div style={styles.registerCard}>

                {/* Heading */}

                <h1 style={styles.title}>
                    Create Account ✨
                </h1>

                <p style={styles.subtitle}>
                    Register to create your account
                </p>


                {/* Register Form */}

                <form onSubmit={handleRegister}>

                    {/* Username */}

                    <div style={styles.inputGroup}>

                        <label style={styles.label}>
                            Username
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            style={styles.input}
                            required
                        />

                    </div>


                    {/* Email */}

                    <div style={styles.inputGroup}>

                        <label style={styles.label}>
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            style={styles.input}
                            required
                        />

                    </div>


                    {/* Password */}

                    <div style={styles.inputGroup}>

                        <label style={styles.label}>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            style={styles.input}
                            required
                        />

                    </div>


                    {/* Register Button */}

                    <button
                        type="submit"
                        style={styles.registerButton}
                    >
                        Register
                    </button>

                </form>


                {/* Divider */}

                <div style={styles.divider}>

                    <span style={styles.line}></span>

                    <span style={styles.orText}>
                        OR
                    </span>

                    <span style={styles.line}></span>

                </div>


                {/* Login Section */}

                <p style={styles.loginText}>
                    Already have an account?
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    style={styles.loginButton}
                >
                    Go to Login
                </button>

            </div>

        </div>
    );
};


/* ============================= */
/* Internal Styles */
/* ============================= */

const styles = {

    page: {
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f6f8",
        padding: "20px",
        boxSizing: "border-box"
    },

    registerCard: {
        width: "100%",
        maxWidth: "420px",
        backgroundColor: "#ffffff",
        padding: "40px",
        borderRadius: "15px",
        boxSizing: "border-box",
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.12)"
    },

    title: {
        textAlign: "center",
        margin: "0 0 8px",
        fontSize: "30px",
        color: "#222"
    },

    subtitle: {
        textAlign: "center",
        margin: "0 0 30px",
        color: "#777",
        fontSize: "15px"
    },

    inputGroup: {
        marginBottom: "20px"
    },

    label: {
        display: "block",
        marginBottom: "8px",
        fontSize: "15px",
        fontWeight: "600",
        color: "#333"
    },

    input: {
        width: "100%",
        padding: "13px 14px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        fontSize: "15px",
        outline: "none",
        boxSizing: "border-box"
    },

    registerButton: {
        width: "100%",
        padding: "13px",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#2563eb",
        color: "#ffffff",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        marginTop: "5px"
    },

    divider: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        margin: "25px 0"
    },

    line: {
        flex: 1,
        height: "1px",
        backgroundColor: "#ddd"
    },

    orText: {
        color: "#888",
        fontSize: "13px"
    },

    loginText: {
        textAlign: "center",
        margin: "0 0 12px",
        color: "#555",
        fontSize: "14px"
    },

    loginButton: {
        width: "100%",
        padding: "12px",
        border: "1px solid #2563eb",
        borderRadius: "8px",
        backgroundColor: "#ffffff",
        color: "#2563eb",
        fontSize: "15px",
        fontWeight: "600",
        cursor: "pointer"
    }
};

export default RegisterPage;