import { useEffect, useState } from "react";
import axios from "axios"
import CreatePost from "./CreatePost";
import Post from "./Post";
import "./Forum.css";

export default function Forum() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const res = await axios.get("/posts");
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="forum-container">
      <header className="forum-header">
        <h1>Scam Forum</h1>
        <p>Share scams you've encountered and learn from others.</p>
      </header>

      <CreatePost onCreated={(p) => setPosts([p, ...posts])} />

      {posts.map((p) => (
        <Post key={p._id} post={p} refresh={fetchPosts} />
      ))}
    </div>
  );
}
