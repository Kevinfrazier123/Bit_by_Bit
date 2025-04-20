// src/components/home/Home.jsx

import React from 'react';
import './Home.css';

import voteIcon from '../Assests/vote.png';
import postScamIcon from '../Assests/postscam.png';
import commentIcon from '../Assests/comment.png';
import usersIcon from '../Assests/users.png';
import newsIcon from '../Assests/news.png';
import backgroundImg from '../Assests/homepage back.png';

const Home = () => {
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

        <button className="about-btn" onClick={() => window.location.href = '/about'}>
          About Us
        </button>
      </section>

      {/* Features */}
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
            <small>Posted shared: 6 member since: Jan 2023</small>
          </div>
          <div className="user-card">
            <img src={usersIcon} alt="User" />
            <p>@username234</p>
            <small>Posted shared: 4 member since: Feb 2023</small>
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

