import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./CreatePost.css";

const scamOptions = [
  "Phishing",
  "Smishing",
  "Investment",
  "Romance",
  "Tech‑Support",
  "Other",
];

export default function CreatePost({ onCreated }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [desc, setDesc] = useState("");
  const [type, setType] = useState("Phishing");
  const [tags, setTags] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Current user:", user);

    try {
      const res = await axios.post(
        "/posts",
        {
          description: desc,
          scamType: type,
          hashtags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        },
        { withCredentials: true }
      );
      onCreated(res.data);
      setDesc("");
      setTags("");
      setType("Phishing");
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
      <textarea
        required
        placeholder="Describe the scam experience…"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      <div className="row">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {scamOptions.map((o) => (
            <option key={o}>{o}</option>
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
