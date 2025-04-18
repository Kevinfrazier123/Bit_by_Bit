// Backend/controllers/post.js
import Post from "../models/Post.js";
import { createError } from "../utils/error.js";  

// CREATE
export const createPost = async (req, res, next) => {
  try {
    const newPost = new Post({
      userId: req.user.id,     // set by verifyToken
      ...req.body,             // description, scamType, hashtags
    });
    const saved = await newPost.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

// LIKE / UNLIKE
export const toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(createError(404, "Post not found"));

    const idx = post.likes.indexOf(req.user.id);
    idx === -1 ? post.likes.push(req.user.id) : post.likes.splice(idx, 1);

    await post.save();
    res.status(200).json({ likes: post.likes.length });
  } catch (err) {
    next(err);
  }
};

// COMMENT
export const addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(createError(404, "Post not found"));

    post.comments.push({ userId: req.user.id, text: req.body.text });
    await post.save();
    res.status(200).json(post.comments[post.comments.length - 1]);
  } catch (err) {
    next(err);
  }
};

// GET ALL
export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};
