// src/components/forum/CreatePost.jsx

import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./CreatePost.css";

const scamOptions = [
  "Phishing",
  "Smishing",
  "Investment",
  "Romance",
  "Tech-Support",
  "Other",
];

// Expanded keyword list
const KEYWORDS = [
  "urgent","limited time","verify","account","password",
  "threat","legal","action","police","ssn",
  "owe","wire","transfer","tax","irs","immediately"
];

export default function CreatePost({ onCreated }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [desc, setDesc] = useState("");
  const [type, setType] = useState("Phishing");
  const [tags, setTags] = useState("");
  const [riskLevel, setRiskLevel] = useState(1);

  // Compute risk based on *number* of keywords matched
  function computeRiskLevel(text) {
    const lower = text.toLowerCase();
    const foundCount = KEYWORDS.reduce(
      (count, kw) => count + (lower.includes(kw) ? 1 : 0),
      0
    );
    // Map foundCount to 1–5:
    // 0–1 → 1, 2–3 → 2, 4–5 → 3, 6–8 → 4, 9+ → 5
    if (foundCount >= 9) return 5;
    if (foundCount >= 6) return 4;
    if (foundCount >= 4) return 3;
    if (foundCount >= 2) return 2;
    return 1;
  }

  // Recompute whenever description changes
  useEffect(() => {
    setRiskLevel(computeRiskLevel(desc));
  }, [desc]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must log in to post.");
      return navigate("/login");
    }

    try {
      const res = await axios.post(
        "/posts",
        {
          description: desc,
          scamType:    type,
          hashtags:    tags.split(",").map(t => t.trim()).filter(Boolean),
          riskLevel,   // send your computed risk
        },
        { withCredentials: true }
      );
      onCreated(res.data);
      setDesc("");
      setTags("");
      setType("Phishing");
      setRiskLevel(1);
    } catch (err) {
      console.error("Post error:", err);
      if (err.response?.status === 401) {
        alert("You must log in to post.");
        navigate("/login");
      }
    }
  };

  return (
    <form className="create-post" onSubmit={handleSubmit}>
      <div className={`risk-badge risk-${riskLevel}`}>
        Risk: {riskLevel} / 5
      </div>
      <textarea
        required
        placeholder="Describe the scam experience…"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <div className="row">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {scamOptions.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="#hashtags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
      <button type="submit">Post</button>
    </form>
  );
} 
 
