import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../header/Header";
import Post from "./Post";
import ActiveUsers from "../sidebar/ActiveUsers";
import "./Forum.css";

export default function Forum() {
  const [posts, setPosts] = useState([]);

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

  return (
    <>
      <Header />

      <div className="forum-container">
        <div className="forum-main">
          <header className="forum-header">
            <h1>Scam Forum</h1>
            <p>Share scams you've encountered and learn from others.</p>
          </header>


          {posts.map((p) => (
            <Post key={p._id} post={p} refresh={fetchPosts} />
          ))}
        </div>

        <aside className="forum-sidebar">
          <ActiveUsers />
        </aside>
      </div>
    </>
  );
}
