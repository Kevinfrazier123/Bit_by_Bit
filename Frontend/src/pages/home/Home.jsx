// src/components/Header.jsx
import React from "react";
import "./home.css"; // optional for styling
import { useNavigate } from 'react-router-dom';

import voteIcon from '../../components/Assests/vote.png';
import postScamIcon from '../../components/Assests/postscam.png';
import commentIcon from '../../components/Assests/comment.png';
import usersIcon from '../../components/Assests/users.png';
import newsIcon from '../../components/Assests/news.png';
import backgroundImg from '../../components/Assests/homepage back.png';


const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section
        className="home-hero"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        <h1>Bit by Bit</h1>
        <p>Stay alert. Stay safe. Report and discuss online scams in one place.</p>
        <span className="trusted-text">
          Trusted by 500+ users to report scams safely.
        </span>

        <div className="hero-buttons">
          <button className="about-btn" onClick={() => navigate('/about')}>
            About Us
          </button>
          <button className="login-btn" onClick={() => navigate('/login')}>
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
            <small>Posts shared: 6 | Member since: Jan 2023</small>
          </div>
          <div className="user-card">
            <img src={usersIcon} alt="User" />
            <p>@username234</p>
            <small>Posts shared: 4 | Member since: Feb 2023</small>
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
  );
};

export default Home;
