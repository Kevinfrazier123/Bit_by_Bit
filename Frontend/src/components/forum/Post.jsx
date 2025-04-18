import { useState, useContext } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import api from "../../api";
import { AuthContext } from "../../context/AuthContext";
import "./Post.css";              // optional extra styling

export default function Post({ post, refresh }) {
  const { user } = useContext(AuthContext);
  const [liked, setLiked] = useState(post.likes.includes(user?._id));
  const [likeCount, setLikeCount] = useState(post.likes.length);

  const toggleLike = async () => {
    await api.put(`/posts/${post._id}/like`);
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const addComment = async () => {
    const text = prompt("Your comment:");
    if (!text) return;
    await api.post(`/posts/${post._id}/comment`, { text });
    refresh();              // re‑fetch list so counts update
  };

  return (
    <article className="post">
      {post.image && (
        <img src={post.image} alt="Scam example" className="post-image" />
      )}

      <div className="post-content">
        <p>{post.description}</p>
        <small>
          Type: <strong>{post.scamType}</strong> &nbsp;|&nbsp;{" "}
          {post.hashtags.map((h) => "#" + h).join(" ")}
        </small>
      </div>

      <div className="post-interactions">
        <span className="like-btn" onClick={toggleLike}>
          {liked ? <FaHeart color="red" /> : <FaRegHeart />} {likeCount}
        </span>
        <span className="comment-btn" onClick={addComment}>
          💬 {post.comments.length}
        </span>
        <span className="share-btn">↗️</span>
      </div>
    </article>
  );
}
