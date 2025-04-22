import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../header/Header";
import Post from "./Post";
import ActiveUsers from "../sidebar/ActiveUsers";
import CreatePost from "./CreatePost";
import "./Forum.css";

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [sortOption, setSortOption] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true); // 🟡 NEW: Loading state

  const fetchPosts = async () => {
    try {
      setLoading(true); // Start loading
      const res = await axios.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Fetch posts error:", err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 120000); // ⏱️Auto update Every 2 minutes
    return () => clearInterval(interval);
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

  const filteredPosts = sortedPosts.filter((p) =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.hashtags || []).some((tag) =>
      tag?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <>
      <Header />
      <div className="forum-container">
        <div className="forum-main">
          <header className="forum-header">
            <h1>Scam Forum</h1>
            <p>Share scams you've encountered and learn from others.</p>
          </header>

          {/* Sort Dropdown */}
          <div className="forum-sort">
            <label htmlFor="sort">Sort by: </label>
            <select id="sort" onChange={handleSortChange} value={sortOption}>
              <option value="newest">Newest</option>
              <option value="liked">Most Liked</option>
            </select>
          </div>

          {/* Search Bar */}
          <div className="forum-search">
            <input
              type="text"
              placeholder="Search scams, hashtags, or usernames..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          

          {/* Loading indicator */}
          {loading ? (
            <p className="loading-text">Loading posts...</p>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((p) => (
              <Post key={p._id} post={p} refresh={fetchPosts} />
            ))
          ) : (
            <p>No posts found matching your search.</p>
          )}
        </div>

        <aside className="forum-sidebar">
          <ActiveUsers />
        </aside>
      </div>
    </>
  );
}