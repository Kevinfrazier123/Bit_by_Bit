// src/components/forum/Post.jsx
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
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `/posts/${post._id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLiked(!liked);
      setLikeCount(data.likes);
    } catch (error) {
      console.error("Error liking post:", error);
      alert("An error occurred while liking the post.");
    }
  };

  const deletePost = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    await axios.delete(`/posts/${post._id}`);
    refresh();
  };

  // 1) split into words, take first 6
  const words = post.description.split(/\s+/);
  const needsTruncate = words.length > 6;
  const preview = needsTruncate
    ? words.slice(0, 6).join(" ")
    : post.description;

  return (
    <article className="post" onClick={() => navigate(`/posts/${post._id}`)}>
      {/* Badge + Title */}
      <div className="post-header">
        <span className={`post-type type-${post.scamType.toLowerCase()}`}>
          {post.scamType}
        </span>
        <h3 className="post-title">{post.title}</h3>
      </div>

      {/* Image */}
      {post.image && (
        <img
          src={post.image}
          alt={post.description || "Post image"}
          className="post-image"
        />
      )}

      {/* Author & Timestamp */}
      <div className="post-meta">
        <span className="post-author">
          Posted by @
          <span
            style={{
              fontStyle: !post.username ? "italic" : "normal",
              color: !post.username ? "#888" : "#000",
            }}
          >
            {post.username || "unknown"}
          </span>
        </span>
        <span className="post-time">
          {new Date(post.createdAt).toLocaleString()}
        </span>
      </div>

      {/* Truncated Description + See more */}
      <div className="post-content">
        <p>
          {preview}
          {needsTruncate && (
            <>
              ...{" "}
              <span
                className="see-more"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/posts/${post._id}`);
                }}
              >
                See more
              </span>
            </>
          )}
        </p>
      </div>

      {/* Hashtags */}
      {post.hashtags.length > 0 && (
        <div className="post-hashtags">
          {post.hashtags.map((h) => (
            <span key={h} className="hashtag">
              #{h}
            </span>
          ))}
        </div>
      )}

      {/* Interactions */}
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