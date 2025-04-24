// src/pages/post/PostDetail.jsx

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaRegHeart, FaHeart, FaTrash } from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./PostDetail.css";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingCommentId, setReplyingCommentId] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(`/posts/${id}`);
      setPost(data);
    })();
  }, [id]);

  if (!post) return <p className="loading">Loading…</p>;

  // Total comments includes replies
  const totalComments = post.comments.reduce(
    (sum, c) => sum + 1 + (c.replies?.length || 0),
    0
  );

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

  const deleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    await axios.delete(`/posts/${id}/comment/${commentId}`);
    setPost((p) => ({
      ...p,
      comments: p.comments.filter((c) => c._id !== commentId),
    }));
  };

  const handleSubmitReply = async (commentId) => {
    if (!replyText.trim()) return;
    const { data } = await axios.post(
      `/posts/${id}/comment/${commentId}/reply`,
      { text: replyText.trim() }
    );
    setPost((p) => ({
      ...p,
      comments: p.comments.map((c) =>
        c._id === commentId
          ? { ...c, replies: [...(c.replies || []), data] }
          : c
      ),
    }));
    setReplyText("");
    setReplyingCommentId(null);
  };

  const deleteReply = async (commentId, replyId) => {
    if (!window.confirm("Delete this reply?")) return;
    await axios.delete(`/posts/${id}/comment/${commentId}/reply/${replyId}`);
    setPost((p) => ({
      ...p,
      comments: p.comments.map((c) =>
        c._id === commentId
          ? { ...c, replies: c.replies.filter((r) => r._id !== replyId) }
          : c
      ),
    }));
  };

  const deletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    await axios.delete(`/posts/${id}`);
    navigate("/forum");
  };

  const isAuthor =
    user && String(user._id) === String(post.userId?._id ?? post.userId);

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="post-detail-card">
        {isAuthor && (
          <FaTrash className="detail-delete-btn" onClick={deletePost} />
        )}

        {/* Header: badge + title + risk */}
        <div className="post-header">
          <span className={`type-badge type-${post.scamType.toLowerCase()}`}>
            {post.scamType}
          </span>
          <h1 className="detail-title">{post.title}</h1>
          <span className={`risk-badge risk-${post.riskLevel}`}>
            Risk: {post.riskLevel}/5
          </span>
        </div>

        {/* Image */}
        {post.image && (
          <img
            src={post.image}
            alt={post.description || "Post image"}
            className="detail-image"
          />
        )}

        {/* Description */}
        <p className="detail-desc">{post.description}</p>

        {/* Likes */}
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

      {/* Comments & Replies */}
      <section className="comments-section">
        <h3>Comments ({totalComments})</h3>
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
          {post.comments.map((c) => (
            <li
              key={c._id}
              className="comment-item"
              onClick={(e) => {
                e.stopPropagation();
                setReplyingCommentId(c._id);
                setReplyText("");
              }}
            >
              <div className="comment-text">{c.text}</div>
              <div className="comment-meta">
                <span className="comment-author">{c.userId.username}</span>
                <span className="comment-date">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
                {user && String(user._id) === String(c.userId) && (
                  <FaTrash
                    className="comment-delete-btn"
                    onClick={() => deleteComment(c._id)}
                  />
                )}
              </div>

              {c.replies && c.replies.length > 0 && (
                <ul className="replies-list">
                  {c.replies.map((r) => (
                    <li
                      key={r._id}
                      className="reply-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        setReplyingCommentId(c._id);
                        setReplyText("@" + r.userId.username + " ");
                      }}
                    >
                      <div className="reply-text">
                        <span className="reply-author">
                          @{r.userId.username}
                        </span>{" "}
                        {r.text}
                        {user && String(user._id) === String(r.userId) && (
                          <FaTrash
                            className="reply-delete-btn"
                            onClick={() => deleteReply(c._id, r._id)}
                          />
                        )}
                      </div>
                      <div className="reply-date">
                        {new Date(r.createdAt).toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {replyingCommentId === c._id && (
                <div className="reply-form">
                  <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply…"
                  />
                  <button onClick={() => handleSubmitReply(c._id)}>
                    Send
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
