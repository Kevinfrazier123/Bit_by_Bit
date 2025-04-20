// Frontend/src/components/header/Header.jsx
import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import "./Header.css";

export default function Header() {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };


  const handleCreate = () => {
       if (user) navigate("/create-post");
       else navigate("/login");
     };

 

  return (
    <header className="app-header">
      <div className="header-left">
        <Link to="/" className="home-link">
          <FaHome className="home-icon" />
        </Link>
        <div className="logo">Scam Forum</div>
      </div>

      <nav className="main-nav">
        <Link to="/forum" className="nav-item">
          Conversations
        </Link>
        <Link to="/help" className="nav-item">
          Help Others
        </Link>
        <Link to="/categories" className="nav-item">
          Categories
        </Link>
      </nav>

      <div className="header-controls">
        <button className="btn create-post-btn" onClick={handleCreate}>
          Create Post
        </button>

        {user ? (
          <>
            <img
              src={user.profilePic || "/default-avatar.png"}
              alt="avatar"
              className="avatar"
            />
            <span className="username">{user.username}</span>
            <button className="btn logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button
            className="btn login-btn"
            onClick={() => navigate("/login")}
          >
            Log In
          </button>
        )}
      </div>
    </header>
  );
}
