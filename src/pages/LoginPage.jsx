import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = (
) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate  = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "" || password === "") {
      setError("Username and Password cannot be empty");
    } else {
      setError("");
      // Handle login logic here
      console.log("Logging in with", { username, password });
      navigate("/");

    }
  };

  return (
    <div className="login-page">
    <div className="login-container">
      <h1>Login Form</h1>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group1">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            placeholder="Type username.."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group1">
          <label htmlFor="password">Password:</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Type password.."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label class="custom-checkbox">
            <input
              type="checkbox"
              id="customCheckbox"
              onClick={() => setShowPassword(!showPassword)}
            />
            <span class="checkmark"></span>
            show password
          </label>
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
    </div>
  );
};

export default LoginPage;
