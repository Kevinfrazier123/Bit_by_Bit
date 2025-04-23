import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../header/Header";
import Post from "./Post";
import ActiveUsers from "../sidebar/ActiveUsers";
import { AuthContext } from "../../context/AuthContext";
import "./Forum.css";

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [sortOption, setSortOption] = useState("newest");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const res = await axios.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Fetch posts error:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortOption === "liked") {
      return b.likes.length - a.likes.length;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <>
      <Header />

      <div className="forum-container">
        <div className="forum-main">
          <header className="forum-header">
            <h1>Scam Forum</h1>
            <p>Share scams you've encountered and learn from others.</p>
             {user && (
                <button
                  className="create-post-btn"
                  onClick={() => navigate("/create-post")}
                >
                  Create Post
                </button>
              )}
          </header>

          {/* Sort Dropdown */}
          <div className="forum-sort">
            <label htmlFor="sort">Sort by: </label>
            <select id="sort" onChange={handleSortChange} value={sortOption}>
              <option value="newest">Newest</option>
              <option value="liked">Most Liked</option>
            </select>
          </div>

          {/* Posts List */}
          <div className="posts">
            {sortedPosts.map((p) => (
              <Post key={p._id} post={p} refresh={fetchPosts} />
            ))}
          </div>
        </div>

        <aside className="forum-sidebar">
          <ActiveUsers />
        </aside>
      </div>
    </>
  );
}
