// src/pages/search/SearchResults.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./SearchResults.css";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    // MOCK DATA for testing UI
    const mock = [
      { id: 1, title: "Phishing Email Report", summary: "Got an email from abc@xyz.com asking for your password..." },
      { id: 2, title: "Fake Marketplace Scam", summary: "Seller requested payment via gift cards..." },
    ];
    setTimeout(() => {
      setResults(mock);
      setLoading(false);
    }, 500);
  }, [query]);
  
  if (!query) {
    return <p className="search-prompt">Please enter a search term above.</p>;
  }

  return (
    <div className="search-results-container">
      <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
      <h2>Results for “{query}”</h2>
      {loading && <p>Loading…</p>}
      {!loading && results.length === 0 && <p>No reports found.</p>}
      <div className="results-grid">
        {results.map((item) => (
          <div key={item.id} className="result-card">
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            <button onClick={() => navigate(`/posts/${item.id}`)}>
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
