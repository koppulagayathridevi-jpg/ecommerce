// // import React, { useState } from "react";
// // import { useNavigate } from "react-router-dom";

// // function LoginPage() {

// //     const [username, setUsername] = useState("");
// //     const [password, setPassword] = useState("");

// //     const navigate = useNavigate();

// //     const handleLogin = async (e) => {

// //         e.preventDefault();

// //         try {

// //             const response = await fetch(
// //                 "http://127.0.0.1:8000/api/login/",
// //                 {
// //                     method: "POST",

// //                     headers: {
// //                         "Content-Type": "application/json"
// //                     },

// //                     body: JSON.stringify({
// //                         username: username,
// //                         password: password
// //                     })
// //                 }
// //             );

// //             const data = await response.json();

// //             console.log("Status:", response.status);
// //             console.log("Login response:", data);

// //             if (response.ok) {

// //                 localStorage.setItem("accessToken", data.access);
// //                 localStorage.setItem("refreshToken", data.refresh);

// //                 console.log("Login successfully");

// //                 navigate("/home");

// //             } else {

// //                 console.log("Login failed:", data);

// //             }

// //         } catch (error) {

// //             console.log("Error:", error);

// //         }
// //     };

// //     return (

// //         <div style={styles.page}>

// //             <div style={styles.loginCard}>

// //                 {/* Heading */}

// //                 <h1 style={styles.title}>
// //                     Welcome Back 👋
// //                 </h1>

// //                 <p style={styles.subtitle}>
// //                     Login to your account
// //                 </p>


// //                 {/* Login Form */}

// //                 <form onSubmit={handleLogin}>

// //                     {/* Username */}

// //                     <div style={styles.inputGroup}>

// //                         <label style={styles.label}>
// //                             Username
// //                         </label>

// //                         <input
// //                             type="text"
// //                             placeholder="Enter your username"
// //                             value={username}
// //                             onChange={(e) =>
// //                                 setUsername(e.target.value)
// //                             }
// //                             style={styles.input}
// //                             required
// //                         />

// //                     </div>


// //                     {/* Password */}

// //                     <div style={styles.inputGroup}>

// //                         <label style={styles.label}>
// //                             Password
// //                         </label>

// //                         <input
// //                             type="password"
// //                             placeholder="Enter your password"
// //                             value={password}
// //                             onChange={(e) =>
// //                                 setPassword(e.target.value)
// //                             }
// //                             style={styles.input}
// //                             required
// //                         />

// //                     </div>


// //                     {/* Login Button */}

// //                     <button
// //                         type="submit"
// //                         style={styles.loginButton}
// //                     >
// //                         Login
// //                     </button>

// //                 </form>


// //                 {/* Divider */}

// //                 <div style={styles.divider}>
// //                     <span style={styles.line}></span>

// //                     <span style={styles.orText}>
// //                         OR
// //                     </span>

// //                     <span style={styles.line}></span>
// //                 </div>


// //                 {/* Register Section */}

// //                 <p style={styles.registerText}>
// //                     Don't have an account?
// //                 </p>

// //                 <button
// //                     type="button"
// //                     onClick={() => navigate("/register")}
// //                     style={styles.registerButton}
// //                 >
// //                     Go to Register
// //                 </button>

// //             </div>

// //         </div>
// //     );
// // }


// // /* ============================= */
// // /* Internal Styles */
// // /* ============================= */

// // const styles = {

// //     page: {
// //         minHeight: "100vh",
// //         width: "100%",
// //         display: "flex",
// //         justifyContent: "center",
// //         alignItems: "center",
// //         backgroundColor: "#f4f6f8",
// //         padding: "20px",
// //         boxSizing: "border-box"
// //     },

// //     loginCard: {
// //         width: "100%",
// //         maxWidth: "420px",
// //         backgroundColor: "#ffffff",
// //         padding: "40px",
// //         borderRadius: "15px",
// //         boxSizing: "border-box",
// //         boxShadow: "0 8px 25px rgba(0,0,0,0.12)"
// //     },

// //     title: {
// //         textAlign: "center",
// //         margin: "0 0 8px",
// //         fontSize: "30px",
// //         color: "#222"
// //     },

// //     subtitle: {
// //         textAlign: "center",
// //         margin: "0 0 30px",
// //         color: "#777",
// //         fontSize: "15px"
// //     },

// //     inputGroup: {
// //         marginBottom: "20px"
// //     },

// //     label: {
// //         display: "block",
// //         marginBottom: "8px",
// //         fontSize: "15px",
// //         fontWeight: "600",
// //         color: "#333"
// //     },

// //     input: {
// //         width: "100%",
// //         padding: "13px 14px",
// //         border: "1px solid #ccc",
// //         borderRadius: "8px",
// //         fontSize: "15px",
// //         outline: "none",
// //         boxSizing: "border-box"
// //     },

// //     loginButton: {
// //         width: "100%",
// //         padding: "13px",
// //         border: "none",
// //         borderRadius: "8px",
// //         backgroundColor: "#2563eb",
// //         color: "#ffffff",
// //         fontSize: "16px",
// //         fontWeight: "600",
// //         cursor: "pointer",
// //         marginTop: "5px"
// //     },

// //     divider: {
// //         display: "flex",
// //         alignItems: "center",
// //         gap: "10px",
// //         margin: "25px 0"
// //     },

// //     line: {
// //         flex: 1,
// //         height: "1px",
// //         backgroundColor: "#ddd"
// //     },

// //     orText: {
// //         color: "#888",
// //         fontSize: "13px"
// //     },

// //     registerText: {
// //         textAlign: "center",
// //         margin: "0 0 12px",
// //         color: "#555",
// //         fontSize: "14px"
// //     },

// //     registerButton: {
// //         width: "100%",
// //         padding: "12px",
// //         border: "1px solid #2563eb",
// //         borderRadius: "8px",
// //         backgroundColor: "#ffffff",
// //         color: "#2563eb",
// //         fontSize: "15px",
// //         fontWeight: "600",
// //         cursor: "pointer"
// //     }
// // };

// // export default LoginPage;

// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";

// function LoginPage() {
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [showPassword, setShowPassword] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     const navigate = useNavigate();

//     const handleLogin = async (e) => {
//         e.preventDefault();

//         setError("");

//         if (!username.trim() || !password.trim()) {
//             setError("Please enter username and password.");
//             return;
//         }

//         setLoading(true);

//         try {
//             const response = await fetch(
//                 "http://127.0.0.1:8000/api/login/",
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify({
//                         username: username.trim(),
//                         password: password,
//                     }),
//                 }
//             );

//             const data = await response.json();

//             console.log("Status:", response.status);
//             console.log("Login response:", data);

//             if (!response.ok) {
//                 const message =
//                     data?.detail ||
//                     data?.non_field_errors?.[0] ||
//                     data?.message ||
//                     "Invalid username or password.";

//                 setError(message);
//                 return;
//             }

//             // Save authentication data
//             localStorage.setItem("accessToken", data.access);
//             localStorage.setItem("refreshToken", data.refresh);

//             // Save user information
//             localStorage.setItem("username", data.username || username);
//             localStorage.setItem("email", data.email || "");

//             // Save admin/staff status
//             const isAdmin =
//                 data.is_staff === true ||
//                 data.is_superuser === true;

//             localStorage.setItem("isStaff", String(data.is_staff === true));
//             localStorage.setItem(
//                 "isSuperuser",
//                 String(data.is_superuser === true)
//             );

//             console.log("Login successful");
//             console.log("Admin:", isAdmin);

//             // // Admin → Admin Dashboard
//             // if (isAdmin) {
//             //     navigate("/admin-dashboard");
//             //     return;
//             // }

//             // Admin → Admin Dashboard
// if (isAdmin) {
//     navigate("/homes");
//     return;
// }

//             // Normal user → Home
//             navigate("/home");

//         } catch (error) {
//             console.error("Login error:", error);
//             setError(
//                 "Unable to connect to the server. Please make sure Django is running."
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <>
//             <style>{`
//                 * {
//                     box-sizing: border-box;
//                 }

//                 body {
//                     margin: 0;
//                     font-family: Arial, Helvetica, sans-serif;
//                     background: #f5f7fb;
//                 }

//                 .login-page {
//                     min-height: 100vh;
//                     display: flex;
//                     align-items: center;
//                     justify-content: center;
//                     padding: 20px;
//                     background: linear-gradient(
//                         135deg,
//                         #f5f7fb 0%,
//                         #eef2ff 100%
//                     );
//                 }

//                 .login-card {
//                     width: 100%;
//                     max-width: 420px;
//                     background: #ffffff;
//                     padding: 38px 34px;
//                     border-radius: 18px;
//                     box-shadow: 0 15px 45px rgba(0, 0, 0, 0.10);
//                 }

//                 .login-title {
//                     text-align: center;
//                     margin-bottom: 8px;
//                     font-size: 30px;
//                     font-weight: 700;
//                     color: #222;
//                 }

//                 .login-subtitle {
//                     text-align: center;
//                     color: #777;
//                     font-size: 14px;
//                     margin-bottom: 30px;
//                 }

//                 .form-group {
//                     margin-bottom: 20px;
//                 }

//                 .form-group label {
//                     display: block;
//                     margin-bottom: 8px;
//                     font-size: 14px;
//                     font-weight: 600;
//                     color: #333;
//                 }

//                 .input-wrapper {
//                     position: relative;
//                 }

//                 .form-input {
//                     width: 100%;
//                     height: 48px;
//                     padding: 0 14px;
//                     border: 1px solid #d9dce5;
//                     border-radius: 10px;
//                     outline: none;
//                     font-size: 15px;
//                     transition: 0.2s;
//                 }

//                 .password-input {
//                     padding-right: 75px;
//                 }

//                 .form-input:focus {
//                     border-color: #667eea;
//                     box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.12);
//                 }

//                 .show-password {
//                     position: absolute;
//                     right: 12px;
//                     top: 50%;
//                     transform: translateY(-50%);
//                     border: none;
//                     background: transparent;
//                     color: #667eea;
//                     font-size: 13px;
//                     font-weight: 600;
//                     cursor: pointer;
//                 }

//                 .error-message {
//                     background: #fff1f1;
//                     color: #d93025;
//                     border: 1px solid #ffd1d1;
//                     padding: 11px 13px;
//                     border-radius: 8px;
//                     font-size: 14px;
//                     margin-bottom: 18px;
//                 }

//                 .login-button {
//                     width: 100%;
//                     height: 48px;
//                     border: none;
//                     border-radius: 10px;
//                     background: #667eea;
//                     color: white;
//                     font-size: 16px;
//                     font-weight: 600;
//                     cursor: pointer;
//                     transition: 0.2s;
//                 }

//                 .login-button:hover {
//                     background: #5568d9;
//                 }

//                 .login-button:disabled {
//                     background: #aeb7e8;
//                     cursor: not-allowed;
//                 }

//                 .register-text {
//                     text-align: center;
//                     margin-top: 22px;
//                     color: #777;
//                     font-size: 14px;
//                 }

//                 .register-link {
//                     color: #667eea;
//                     font-weight: 600;
//                     text-decoration: none;
//                 }

//                 .register-link:hover {
//                     text-decoration: underline;
//                 }

//                 @media (max-width: 480px) {
//                     .login-page {
//                         padding: 15px;
//                     }

//                     .login-card {
//                         padding: 30px 22px;
//                         border-radius: 15px;
//                     }

//                     .login-title {
//                         font-size: 26px;
//                     }
//                 }
//             `}</style>

//             <div className="login-page">
//                 <div className="login-card">

//                     <h1 className="login-title">
//                         Login
//                     </h1>

//                     <p className="login-subtitle">
//                         Login to your E-Commerce account
//                     </p>

//                     <form onSubmit={handleLogin}>

//                         {/* Username */}
//                         <div className="form-group">
//                             <label htmlFor="username">
//                                 Username
//                             </label>

//                             <input
//                                 id="username"
//                                 type="text"
//                                 className="form-input"
//                                 placeholder="Enter username"
//                                 value={username}
//                                 onChange={(e) =>
//                                     setUsername(e.target.value)
//                                 }
//                                 autoComplete="username"
//                             />
//                         </div>

//                         {/* Password */}
//                         <div className="form-group">
//                             <label htmlFor="password">
//                                 Password
//                             </label>

//                             <div className="input-wrapper">
//                                 <input
//                                     id="password"
//                                     type={
//                                         showPassword
//                                             ? "text"
//                                             : "password"
//                                     }
//                                     className="form-input password-input"
//                                     placeholder="Enter password"
//                                     value={password}
//                                     onChange={(e) =>
//                                         setPassword(e.target.value)
//                                     }
//                                     autoComplete="current-password"
//                                 />

//                                 <button
//                                     type="button"
//                                     className="show-password"
//                                     onClick={() =>
//                                         setShowPassword(!showPassword)
//                                     }
//                                 >
//                                     {showPassword ? "Hide" : "Show"}
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Error */}
//                         {error && (
//                             <div className="error-message">
//                                 {error}
//                             </div>
//                         )}

//                         {/* Login Button */}
//                         <button
//                             type="submit"
//                             className="login-button"
//                             disabled={loading}
//                         >
//                             {loading ? "Logging in..." : "Login"}
//                         </button>

//                     </form>

//                     <p className="register-text">
//                         Don't have an account?{" "}
//                         <Link
//                             to="/register"
//                             className="register-link"
//                         >
//                             Register
//                         </Link>
//                     </p>

//                 </div>
//             </div>
//         </>
//     );
// }

// export default LoginPage;

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");

        // Basic validation
        if (!username.trim() || !password.trim()) {
            setError("Please enter username and password.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "http://127.0.0.1:8000/api/login/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: username.trim(),
                        password: password,
                    }),
                }
            );

            const data = await response.json();

            console.log("Login Status:", response.status);
            console.log("Login Response:", data);

            // ==============================
            // LOGIN FAILED
            // ==============================

            if (!response.ok) {
                const message =
                    data?.detail ||
                    data?.non_field_errors?.[0] ||
                    data?.message ||
                    "Invalid username or password.";

                setError(message);
                return;
            }

            // ==============================
            // SAVE JWT TOKENS
            // ==============================

            localStorage.setItem(
                "accessToken",
                data.access
            );

            localStorage.setItem(
                "refreshToken",
                data.refresh
            );

            // ==============================
            // SAVE USER INFORMATION
            // ==============================

            localStorage.setItem(
                "username",
                data.username || username.trim()
            );

            localStorage.setItem(
                "email",
                data.email || ""
            );

            // ==============================
            // CHECK ADMIN / STAFF
            // ==============================

            const isStaff = data.is_staff === true;
            const isSuperuser = data.is_superuser === true;

            const isAdmin = isStaff || isSuperuser;

            // Save admin information
            localStorage.setItem(
                "isStaff",
                String(isStaff)
            );

            localStorage.setItem(
                "isSuperuser",
                String(isSuperuser)
            );

            console.log("Login successful");
            console.log("Username:", data.username);
            console.log("Is Staff:", isStaff);
            console.log("Is Superuser:", isSuperuser);
            console.log("Is Admin:", isAdmin);

            // ==============================
            // NAVIGATION
            // ==============================

            if (isAdmin) {
                // Admin → Homes page
                navigate("/homes");
                return;
            }

            // Normal User → Normal Home
            navigate("/home");

        } catch (error) {
            console.error("Login Error:", error);

            setError(
                "Unable to connect to the server. Please make sure Django is running."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`

                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    font-family: Arial, Helvetica, sans-serif;
                    background: #f5f7fb;
                }

                .login-page {
                    min-height: 100vh;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    padding: 20px;

                    background: linear-gradient(
                        135deg,
                        #f5f7fb 0%,
                        #eef2ff 100%
                    );
                }

                .login-card {
                    width: 100%;
                    max-width: 420px;

                    background: #ffffff;

                    padding: 38px 34px;

                    border-radius: 18px;

                    box-shadow:
                        0 15px 45px
                        rgba(0, 0, 0, 0.10);
                }

                .login-title {
                    text-align: center;

                    margin: 0 0 8px;

                    font-size: 30px;
                    font-weight: 700;

                    color: #222;
                }

                .login-subtitle {
                    text-align: center;

                    color: #777;

                    font-size: 14px;

                    margin: 0 0 30px;
                }

                .form-group {
                    margin-bottom: 20px;
                }

                .form-group label {
                    display: block;

                    margin-bottom: 8px;

                    font-size: 14px;

                    font-weight: 600;

                    color: #333;
                }

                .input-wrapper {
                    position: relative;
                }

                .form-input {
                    width: 100%;
                    height: 48px;

                    padding: 0 14px;

                    border: 1px solid #d9dce5;

                    border-radius: 10px;

                    outline: none;

                    font-size: 15px;

                    transition: 0.2s;
                }

                .password-input {
                    padding-right: 75px;
                }

                .form-input:focus {
                    border-color: #667eea;

                    box-shadow:
                        0 0 0 3px
                        rgba(102, 126, 234, 0.12);
                }

                .show-password {
                    position: absolute;

                    right: 12px;
                    top: 50%;

                    transform: translateY(-50%);

                    border: none;

                    background: transparent;

                    color: #667eea;

                    font-size: 13px;

                    font-weight: 600;

                    cursor: pointer;
                }

                .show-password:hover {
                    color: #5568d9;
                }

                .error-message {
                    background: #fff1f1;

                    color: #d93025;

                    border: 1px solid #ffd1d1;

                    padding: 11px 13px;

                    border-radius: 8px;

                    font-size: 14px;

                    margin-bottom: 18px;
                }

                .login-button {
                    width: 100%;

                    height: 48px;

                    border: none;

                    border-radius: 10px;

                    background: #667eea;

                    color: white;

                    font-size: 16px;

                    font-weight: 600;

                    cursor: pointer;

                    transition: 0.2s;
                }

                .login-button:hover {
                    background: #5568d9;
                }

                .login-button:disabled {
                    background: #aeb7e8;

                    cursor: not-allowed;
                }

                .register-text {
                    text-align: center;

                    margin-top: 22px;

                    color: #777;

                    font-size: 14px;
                }

                .register-link {
                    color: #667eea;

                    font-weight: 600;

                    text-decoration: none;
                }

                .register-link:hover {
                    text-decoration: underline;
                }

                @media (max-width: 480px) {

                    .login-page {
                        padding: 15px;
                    }

                    .login-card {
                        padding: 30px 22px;

                        border-radius: 15px;
                    }

                    .login-title {
                        font-size: 26px;
                    }
                }

            `}</style>

            <div className="login-page">

                <div className="login-card">

                    {/* ==============================
                        TITLE
                    ============================== */}

                    <h1 className="login-title">
                        Login
                    </h1>

                    <p className="login-subtitle">
                        Login to your E-Commerce account
                    </p>


                    {/* ==============================
                        LOGIN FORM
                    ============================== */}

                    <form onSubmit={handleLogin}>

                        {/* USERNAME */}

                        <div className="form-group">

                            <label htmlFor="username">
                                Username
                            </label>

                            <input
                                id="username"
                                type="text"
                                className="form-input"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) =>
                                    setUsername(e.target.value)
                                }
                                autoComplete="username"
                                required
                            />

                        </div>


                        {/* PASSWORD */}

                        <div className="form-group">

                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="input-wrapper">

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    className="form-input password-input"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    autoComplete="current-password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="show-password"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >
                                    {showPassword
                                        ? "Hide"
                                        : "Show"}
                                </button>

                            </div>

                        </div>


                        {/* ERROR */}

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}


                        {/* LOGIN BUTTON */}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Logging in..."
                                : "Login"}
                        </button>

                    </form>


                    {/* ==============================
                        REGISTER
                    ============================== */}

                    <p className="register-text">

                        Don't have an account?{" "}

                        <Link
                            to="/register"
                            className="register-link"
                        >
                            Register
                        </Link>

                    </p>

                </div>

            </div>
        </>
    );
}

export default LoginPage;