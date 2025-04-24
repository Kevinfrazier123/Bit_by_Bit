// src/components/header/Header.jsx
import React, { useContext, useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import "./Header.css";

export default function Header() {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  // Dark mode state
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  const toggleTheme = () => setDark((d) => !d);

  const links = [
    { to: "/", label: "Home" },
    { to: "/forum", label: "Forum" },
  ];

  return (
    <header className="app-header">
      <Link to="/" className="logo">
        ScamSafe
      </Link>

      <nav className="nav-links" role="navigation" aria-label="Main navigation">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              "nav-item" + (isActive ? " active" : "")
            }
          >
            {label}
          </NavLink>
        ))}

        {user ? (
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              "nav-item profile-link" + (isActive ? " active" : "")
            }
            aria-label="Your profile"
          >
            {user.profilePic ? (
              <img
                src={user.profilePic}
                alt={`${user.username}'s avatar`}
                className="header-avatar"
              />
            ) : (
              <span className="avatar-initials">
                {user.username.charAt(0).toUpperCase()}
              </span>
            )}
          </NavLink>
        ) : (
          <NavLink to="/login" className="nav-item">
            Login
          </NavLink>
        )}

        {/* Dark mode toggle */}
        <button
          className="dark-toggle"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
        >
          {dark ? <FaSun /> : <FaMoon />}
        </button>

        {user && (
          <button className="nav-item logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}
