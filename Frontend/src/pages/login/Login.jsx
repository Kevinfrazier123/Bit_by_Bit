// src/pages/login/Login.jsx
import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./login.css";

export default function Login() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/auth/login", credentials, { withCredentials: true });
      const userPayload = res.data.details ?? res.data.user ?? res.data;
      dispatch({ type: "LOGIN_SUCCESS", payload: userPayload });
      navigate("/forum");
    } catch (err) {
      const payload = err.response?.data || { message: err.message };
      dispatch({ type: "LOGIN_FAILURE", payload });
    }
  };

  return (
    <div className="loginPage">
      <div className="animatedBackground" />
      <div className="loginBox">
        <h2>Sign In</h2>

        <label htmlFor="username" className="lLabel">Username</label>
        <input
          type="text"
          id="username"
          placeholder="Username"
          className="lInput"
          onChange={handleChange}
        />

        <label htmlFor="password" className="lLabel">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="lInput"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          onClick={handleClick}
          className="signInButton"
        >
          Sign In
        </button>

        {error && <span className="errorMessage">{error.message}</span>}

        <div className="forgotPassword">
          <a href="/forgot-password">Forgot password?</a>
        </div>
        <div className="signUp">
          <span>Don’t have an account?</span>
          <a href="/register"> Sign Up</a>
        </div>
      </div>
    </div>
);
}
