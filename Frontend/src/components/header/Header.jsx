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
    { to: "/profile", label: "Profile" },
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

        {/* Dark mode toggle */}
        <button
          className="dark-toggle"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
        >
          {dark ? <FaSun /> : <FaMoon />}
        </button>

        {user ? (
          <button className="nav-item" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <NavLink to="/login" className="nav-item">
            Login
          </NavLink>
        )}
      </nav>
    </header>
  );
}
