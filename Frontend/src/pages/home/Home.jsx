// src/pages/home/Home.jsx

import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

import Header from "../../components/header/Header";
import "./home.css";

import postScamIcon  from "../../components/Assests/postscam.png";
import voteIcon      from "../../components/Assests/vote.png";
import commentIcon   from "../../components/Assests/comment.png";
import usersIcon     from "../../components/Assests/users.png";
import newsIcon      from "../../components/Assests/news.png";
import backgroundImg from "../../components/Assests/homepage back.png";

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  // Initialize the particles engine
  const particlesInit = useCallback(async engine => {
    await loadFull(engine);
  }, []);

  const onSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <>
      <Header />

      <div className="home-container">
        {/* Hero Section */}
        <section
          className="home-hero"
          style={{ backgroundImage: `url(${backgroundImg})` }}
        >
          {/* Particle background, locked to this container */}
          <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
              fullScreen: { enable: false },    // disable full-window canvas
              fpsLimit: 60,
              particles: {
                number: { value: 50, density: { enable: true, area: 800 } },
                size: { value: 3 },
                move: { enable: true, speed: 1 },
                opacity: { value: 0.3 },
              },
              detectRetina: true,
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 0,
              pointerEvents: "none",
            }}
          />

          <h1>Bit by Bit</h1>
          <p>Stay alert. Stay safe. Report and discuss online scams in one place.</p>
          <span className="trusted-text">
            Trusted by 500+ users to report scams safely.
          </span>

          {/* Hero search bar */}
          <div className="hero-search">
            <input
              type="text"
              placeholder="Search scam reports…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && onSearch()}
            />
            <button onClick={onSearch}>🔍</button>
          </div>

          {/* Hero buttons */}
          <div className="hero-buttons">
            <button className="about-btn" onClick={() => navigate("/about")}>
              About Us
            </button>
            <button className="login-btn" onClick={() => navigate("/login")}>
              Login
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="home-features">
          <div className="feature-card">
            <img src={postScamIcon} alt="Post a Scam" />
            <h3>Post a Scam</h3>
            <p>Share what you encountered so others can stay alert.</p>
          </div>
          <div className="feature-card">
            <img src={voteIcon} alt="Vote on Reports" />
            <h3>Vote on Reports</h3>
            <p>Help rate scams based on how risky or suspicious they seem.</p>
          </div>
          <div className="feature-card">
            <img src={commentIcon} alt="Comment and Discuss" />
            <h3>Comment and Discuss</h3>
            <p>Join the conversation and provide helpful feedback or advice.</p>
          </div>
        </section>

        {/* User Profiles */}
        <section className="home-users">
          <h2>User Profiles</h2>
          <div className="user-cards">
            <div className="user-card">
              <img src={usersIcon} alt="User" />
              <p>@username123</p>
              <small>Posts shared: 6 | Member since: Jan 2023</small>
            </div>
            <div className="user-card">
              <img src={usersIcon} alt="User" />
              <p>@username234</p>
              <small>Posts shared: 4 | Member since: Feb 2023</small>
            </div>
          </div>
        </section>

        {/* News Feed */}
        <section className="home-news">
          <h2>News Feed</h2>
          <div className="news-card">
            <img src={newsIcon} alt="News" />
            <p>🔒 Latest in Cybersecurity</p>
            <small>FBI Warns of New Email Scam Targeting Job Seekers</small>
          </div>
        </section>
      </div>
    </>
  );
}
