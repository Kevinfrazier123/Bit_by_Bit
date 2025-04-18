// src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./home.css"; // optional for styling

const Home = () => {
  return (
    <nav className="home">
      {/* Logo or title */}
      <div className="logo">
        
      </div>
      {/* Navigation links */}
      <ul className="navLinks">
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/forum">Forum</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>
      </ul>
    </nav>
  );
};

export default Home;
