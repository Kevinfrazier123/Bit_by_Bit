import React, { useState, useContext } from "react";
import { FaRegHeart, FaHeart, FaRegComment } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./Post.css";

export default function Post({ post, refresh }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [liked, setLiked] = useState(post.likes.includes(user?._id));
  const [likeCount, setLikeCount] = useState(post.likes.length);

  const toggleLike = async (e) => {
    e.stopPropagation();
    const { data } = await axios.put(`/posts/${post._id}/like`);
    setLiked(!liked);
    setLikeCount(data.likes);
  };

  const deletePost = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    await axios.delete(`/posts/${post._id}`);
    refresh();
  };

  return (
    <article className="post" onClick={() => navigate(`/posts/${post._id}`)}>
      <h3 className="post-title">{post.title}</h3>

      {post.image && (
        <img
          src={post.image}
          alt={post.description || "Post image"}
          className="post-image"
        />
      )}

      {/* Author and Time */}
      <div className="post-meta">
        <span className="post-author">Posted by @{post.username}</span>
        <span className="post-time">
          {new Date(post.createdAt).toLocaleString()}
        </span>
      </div>

      <div className="post-content">
        <p>{post.description}</p>
      </div>

      <div className="post-meta-row">
        <span className={`post-type type-${post.scamType.toLowerCase()}`}>
          {post.scamType}
        </span>
        {post.hashtags.length > 0 && (
          <span className="post-hashtags">
            {post.hashtags.map((h) => `#${h}`).join(" ")}
          </span>
        )}
      </div>

      <div className="post-interactions">
        <span className="like-btn" onClick={toggleLike}>
          {liked ? <FaHeart color="red" /> : <FaRegHeart />} {likeCount}
        </span>
        <span
          className="comment-btn"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/posts/${post._id}`);
          }}
        >
          <FaRegComment /> {post.comments.length}
        </span>
        {user && String(user._id) === String(post.userId) && (
          <span className="delete-btn" onClick={deletePost}>
            <FiX />
          </span>
        )}
      </div>
    </article>
  );
}
