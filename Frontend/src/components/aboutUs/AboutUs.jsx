// src/components/aboutUs/AboutUs.jsx

import React, { useState } from 'react';
import './AboutUs.css';
import heroImage from '../Assests/1.png';

const faqData = [
  {
    question: 'Is all the content free?',
    answer:
      'Yes! All reports and discussions are completely free to access.',
  },
  {
    question: 'How do I report a scam?',
    answer:
      'Click the “Report Scam” button in the navigation, fill out the form with details, and submit. Your report will appear once approved.',
  },
  {
    question: 'Can I discuss someone else’s report?',
    answer:
      'Absolutely! Under each report you’ll find a comments section—feel free to share insights or ask questions.',
  },
  {
    question: 'How do you verify reports?',
    answer:
      'Our moderation team reviews submissions against known scam databases before they go live.',
  },
];


const AboutUs = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const toggleFaq = idx => setOpenIndex(openIndex === idx ? null : idx);

  return (
    <div className="about-us-container">
      {/* Hero Banner */}
      <section
        className="hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <h1>About Bit‑by‑Bit</h1>
        <p>All in one place—share experiences, warn others, and stay safe.</p>
      </section>

      {/* Mission Statement */}
      <section className="mission">
        <h2>Our Mission</h2>
        <p>
          We provide a community‑driven platform where anyone can report
          a scam they’ve encountered and discuss prevention tips. Together,
          we aim to build a trusted resource to keep everyone informed and protected.
        </p>
      </section>

      {/* FAQ Section */}
      <section className="faq">
        <h2>FAQ</h2>
        <div className="faq-list">
          {faqData.map((item, i) => (
            <div key={i} className="faq-item">
              <button
                className="faq-question"
                onClick={() => toggleFaq(i)}
              >
                {item.question}
                <span className="faq-toggle">
                  {openIndex === i ? '–' : '+'}
                </span>
              </button>
              {openIndex === i && (
                <p className="faq-answer">{item.answer}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

