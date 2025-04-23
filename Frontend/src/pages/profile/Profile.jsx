// src/pages/profile/Profile.jsx
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./profile.css";

export default function Profile() {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user?.profilePic || "");
  const [username, setUsername] = useState(user?.username || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("bio");
  const [showToast, setShowToast] = useState(false);
  const [secretSequence, setSecretSequence] = useState([]);

  const easterEggs = {
    "arrowuparrowuparrowdownarrowdownarrowleftarrowrightarrowleftarrowrightba": "🎉 Konami Mode Activated!",
    "dev": "👨‍💻 Developer Mode Unlocked!",
    "party": "🎊 Party Time!",
    "matrix": "🟢 Welcome to the Matrix...",
    "hi": "👋 Hey there, user!"
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      const updatedSequence = [...secretSequence, key].slice(-10);
      setSecretSequence(updatedSequence);

      const combined = updatedSequence.join("");
      for (const [code, msg] of Object.entries(easterEggs)) {
        if (combined.includes(code)) {
          triggerEasterEgg(msg);
          setSecretSequence([]);
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [secretSequence]);

  const triggerEasterEgg = (msg) => {
    setMessage(msg);
    setShowToast(true);
    document.body.classList.add("shake");
    setTimeout(() => {
      document.body.classList.remove("shake");
    }, 800);
  };

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  useEffect(() => {
    if (message) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await axios.put(`/users/${user._id}/profile-pic`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      setMessage("Profile picture updated!");
    } catch (err) {
      console.error(err);
      setMessage("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameUpdate = async () => {
    if (username === user?.username) return;
    setLoading(true);
    try {
      const res = await axios.put(`/users/${user._id}`, { username }, { withCredentials: true });
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      setMessage("Username updated!");
    } catch (err) {
      console.error(err);
      setMessage("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "bio":
        return (
          <div className="form-group fade-in">
            <label>Bio</label>
            <textarea
              className="bio-textarea"
              placeholder="Tell us a little about yourself..."
              rows={3}
              disabled
              value="This is a sample bio. It can be edited once the backend is integrated. I really don’t want to touch the backend though. 😅 (knight)"
            />
          </div>
        );
      case "activity":
        return <p className="tab-placeholder fade-in">You have 0 posts and 0 comments (coming soon).</p>;
      case "settings":
        return (
          <div className="fade-in">
            <div className="form-group">
              <label htmlFor="username">Username <span className="edit-icon" title="Edit Username">✏️</span></label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button onClick={handleUsernameUpdate} disabled={loading}>
                {loading ? <div className="spinner" /> : "Update Username"}
              </button>
            </div>
            <div className="form-group">
              <label htmlFor="file">Profile Picture <span className="edit-icon" title="Change Picture">✏️</span></label>
              <input
                id="file"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <button onClick={handleUpload} disabled={loading}>
                {loading ? <div className="spinner" /> : "Upload Picture"}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getInitials = (name) => {
    return name ? name[0].toUpperCase() : "U";
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="avatar-wrapper">
          {preview ? (
            <img src={preview} alt="avatar" className="avatar" />
          ) : (
            <div className="avatar initials">{getInitials(user.username)}</div>
          )}
        </div>
        <h2 className="profile-welcome">Welcome, @{user.username} 👋</h2>

        <div className="profile-tabs">
          <button className={`profile-tab ${activeTab === "bio" ? "active" : ""}`} onClick={() => setActiveTab("bio")}>Bio</button>
          <button className={`profile-tab ${activeTab === "activity" ? "active" : ""}`} onClick={() => setActiveTab("activity")}>Activity</button>
          <button className={`profile-tab ${activeTab === "settings" ? "active" : ""}`} onClick={() => setActiveTab("settings")}>Settings</button>
        </div>

        <div className="profile-details">{renderTabContent()}</div>
      </div>

      {showToast && (
        <div
          className={`toast fade-in-fast ${Object.values(easterEggs).includes(message) ? "easter-egg" : ""}`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
