// src/pages/profile/Profile.jsx
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./profile.css";

export default function Profile() {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(user?.profilePic || "/default-avatar.png");
  const [username, setUsername] = useState(user?.username || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Generate preview when file changes
  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await axios.put(
        `/users/${user._id}/profile-pic`,
        form,
        { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
      );
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
      const res = await axios.put(
        `/users/${user._id}`,
        { username },
        { withCredentials: true }
      );
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      setMessage("Username updated!");
    } catch (err) {
      console.error(err);
      setMessage("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // or a loader
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img src={preview} alt="avatar" className="avatar" />
        <div className="profile-details">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={handleUsernameUpdate} disabled={loading}>
              Update Username
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="file">Profile Picture</label>
            <input
              id="file"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button onClick={handleUpload} disabled={loading}>
              Upload Picture
            </button>
          </div>

          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  );
}
