// Frontend/src/pages/post/PostDetail.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./PostDetail.css";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(`/posts/${id}`);
      setPost(data);
    })();
  }, [id]);

  if (!post) return <p className="loading">Loading…</p>;

  const toggleLike = async () => {
    const { data } = await axios.put(`/posts/${id}/like`);
    setPost((p) => ({ ...p, likes: data.likes }));
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;
    const { data } = await axios.post(`/posts/${id}/comment`, {
      text: newComment.trim(),
    });
    setPost((p) => ({ ...p, comments: [...p.comments, data] }));
    setNewComment("");
  };

  const deletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    await axios.delete(`/posts/${id}`);
    navigate("/forum");
  };

  const isAuthor =
    user &&
    String(user._id) === String(post.userId?._id ?? post.userId);

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="post-detail-card">
        {/* delete “X” button */}
        {isAuthor && (
          <span className="detail-delete-btn" onClick={deletePost}>
            <FiX />
          </span>
        )}

        {post.image && (
          <img
            src={post.image}
            alt={post.description || "Post image"}
            className="detail-image"
          />
        )}

        <div className="post-header">
          <h2 className="detail-title">{post.description}</h2>
          <span className={`type-badge type-${post.scamType.toLowerCase()}`}>
            {post.scamType}
          </span>
        </div>

        <div className="likes">
          <button className="like-btn" onClick={toggleLike}>
            {post.likes.includes(user._id) ? (
              <FaHeart color="red" />
            ) : (
              <FaRegHeart />
            )}{" "}
            {post.likes.length}
          </button>
        </div>
      </div>

      <section className="comments-section">
        <h3>Comments ({post.comments.length})</h3>
        <div className="new-comment">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment…"
          />
          <button className="post-comment-btn" onClick={submitComment}>
            Post
          </button>
        </div>
        <ul className="comments-list">
          {post.comments.map((c, i) => (
            <li key={i} className="comment-item">
              <div className="comment-text">{c.text}</div>
              <div className="comment-meta">
                <span className="comment-author">{c.userId.username}</span>
                <span className="comment-date">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
