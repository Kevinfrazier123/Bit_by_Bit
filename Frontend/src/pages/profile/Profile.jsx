// src/pages/profile/Profile.jsx
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./profile.css";

// Import preset avatars
import avatar1 from "../../components/Assests/avatars/avatar1.png";
import avatar2 from "../../components/Assests/avatars/avatar2.png";
import avatar3 from "../../components/Assests/avatars/avatar3.png";
import avatar4 from "../../components/Assests/avatars/avatar4.png";
import avatar5 from "../../components/Assests/avatars/avatar5.png";
import avatar6 from "../../components/Assests/avatars/avatar6.png";
import avatar7 from "../../components/Assests/avatars/avatar7.png";
import avatar8 from "../../components/Assests/avatars/avatar8.png";
import avatar9 from "../../components/Assests/avatars/avatar9.png";
import avatar10 from "../../components/Assests/avatars/avatar10.png";

export default function Profile() {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const [activeTab, setActiveTab] = useState("bio");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [file, setFile] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState("");
  const [preview, setPreview] = useState(user?.profilePic || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const presets = [
    avatar1, avatar2, avatar3, avatar4, avatar5,
    avatar6, avatar7, avatar8, avatar9, avatar10
  ];

  // Preview uploaded file
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setSelectedPreset("");
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  // Preview selected preset
  useEffect(() => {
    if (selectedPreset) {
      setPreview(selectedPreset);
      setFile(null);
    }
  }, [selectedPreset]);

  // Auto-hide toasts
  useEffect(() => {
    if (message) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Reset preview when switching tabs without save
  const handleTabClick = (tab) => {
    if (activeTab === 'settings' && tab !== 'settings') {
      setPreview(user?.profilePic || "");
      setFile(null);
      setSelectedPreset("");
    }
    if (activeTab === 'bio' && tab !== 'bio') {
      setIsEditingBio(false);
      setBio(user?.bio || "");
    }
    setActiveTab(tab);
  };

  // Commit changes
  const handleSave = async () => {
    setLoading(true);
    try {
      const updates = {};
      if (activeTab === 'bio') {
        if (bio !== user.bio) updates.bio = bio;
      } else {
        if (username !== user.username) updates.username = username;
        if (selectedPreset) updates.profilePic = selectedPreset;
      }
      // Handle file upload
      if (file) {
        const form = new FormData();
        form.append("image", file);
        const resPic = await axios.put(
          `/users/${user._id}/profile-pic`,
          form,
          { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
        );
        dispatch({ type: "LOGIN_SUCCESS", payload: resPic.data });
        delete updates.profilePic;
      }
      if (Object.keys(updates).length) {
        const resUser = await axios.put(
          `/users/${user._id}`,
          updates,
          { withCredentials: true }
        );
        dispatch({ type: "LOGIN_SUCCESS", payload: resUser.data });
      }
      if (activeTab === 'bio') setIsEditingBio(false);
      setMessage("Changes saved!");
    } catch (err) {
      console.error(err);
      setMessage("Save failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Enhanced welcome message styling */}
        <h2 className="profile-welcome">
          Welcome,
          <span className="profile-username"> @{user.username}</span>
        </h2>
        <div className="avatar-wrapper">
          <img src={preview} alt="avatar" className="avatar" />
        </div>

        <div className="profile-tabs">
          {['bio', 'settings'].map(tab => (
            <button
              key={tab}
              className={`profile-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="profile-details">
          {activeTab === 'bio' && (
            <div className="bio-panel fade-in">
              <label className="bio-label">Bio</label>
              {!isEditingBio ? (
                <div className="bio-display">
                  <p className="bio-text">{user.bio || 'No bio set.'}</p>
                  <button
                    className="edit-bio-btn"
                    onClick={() => setIsEditingBio(true)}
                  >
                    Edit Bio
                  </button>
                </div>
              ) : (
                <div className="bio-edit">
                  <textarea
                    className="bio-textarea"
                    rows={4}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    className="save-bio-btn"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-panel fade-in">
              <div className="form-group">
                <label>Username</label>
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Upload Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setFile(e.target.files[0])}
                  disabled={loading}
                />
              </div>

              <div className="form-group presets-grid">
                <label>Select an Avatar</label>
                <div className="presets-container">
                  {presets.map(url => (
                    <img
                      key={url}
                      src={url}
                      alt="avatar preset"
                      className={`preset-img ${preview === url ? 'selected' : ''}`}
                      onClick={() => setSelectedPreset(url)}
                    />
                  ))}
                </div>
              </div>

              <button
                className="save-btn"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        {showToast && <div className="toast fade-in-fast">{message}</div>}
      </div>
    </div>
  );
}
