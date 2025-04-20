import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./CreatePostPage.css";

export default function CreatePostPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("Phishing");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [attachment, setAttachment] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");

    const form = new FormData();
    form.append("title", title);
    form.append("description", desc);
    form.append("scamType", type);
    tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .forEach((t) => form.append("hashtags", t));
    if (image) form.append("image", image);
    if (attachment) form.append("attachment", attachment);

    await axios.post("/posts", form, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    navigate("/forum");
  };

  return (
    <div className="create-post-page">
      <h2>Create a New Post</h2>
      <form className="create-post-form" onSubmit={handleSubmit}>
        <label>
          Title<span className="required">*</span>
          <input
            type="text"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a short, descriptive title"
          />
        </label>

        <label>
          Description<span className="required">*</span>
          <textarea
            value={desc}
            required
            placeholder="Describe the scam experience…"
            onChange={(e) => setDesc(e.target.value)}
          />
        </label>

        <div className="row">
          <label>
            Scam Type
            <select value={type} onChange={(e) => setType(e.target.value)}>
              {["Phishing","Smishing","Investment","Romance","Tech‑Support","Other"].map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </label>

          <label>
            Hashtags
            <input
              type="text"
              value={tags}
              placeholder="#hashtags (comma separated)"
              onChange={(e) => setTags(e.target.value)}
            />
          </label>
        </div>

        <div className="row">
          <label>
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
          <label>
            Upload Document
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setAttachment(e.target.files[0])}
            />
          </label>
        </div>

        <button type="submit" className="btn-post">Post</button>
      </form>
    </div>
  );
}
