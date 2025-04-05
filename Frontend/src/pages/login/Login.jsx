import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/auth/login", credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      navigate("/");
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };

  return (
    <div className="loginPage">
      {/* Animated background container */}
      <div className="animatedBackground"></div>
      
      <div className="loginBox">
        <h2>Sign In</h2>
        
        <label htmlFor="email" className="lLabel">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Value"
          className="lInput"
          onChange={handleChange}
        />

        <label htmlFor="password" className="lLabel">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Value"
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

        {/* Show error message if one exists */}
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
};

export default Login;
