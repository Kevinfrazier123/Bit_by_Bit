// Backend/controllers/post.js
import Post from "../models/Post.js";
import { createError } from "../utils/error.js";

// CREATE
export const createPost = async (req, res, next) => {
  try {
    const { description, scamType, hashtags = [] } = req.body;

    const newPost = new Post({
      title: req.body.title,
      userId: req.user.id,
      description,
      scamType,
      hashtags: Array.isArray(hashtags) ? hashtags : [hashtags],
      image: req.files?.image
        ? `/uploads/${req.files.image[0].filename}`
        : null,
      attachment: req.files?.attachment
        ? `/uploads/${req.files.attachment[0].filename}`
        : null,


        
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
    if (idx === -1) post.likes.push(req.user.id);
    else post.likes.splice(idx, 1);

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

    const comment = { userId: req.user.id, text: req.body.text };
    post.comments.push(comment);
    await post.save();
    res.status(200).json(comment);
  } catch (err) {
    next(err);
  }
};

// GET ALL
export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("userId", "username profilePic")
      .populate("comments.userId", "username");

    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

// DELETE
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(createError(404, "Post not found"));

    // compare as strings so ObjectId vs. string match correctly
    if (post.userId.toString() !== req.user.id) {
      return next(createError(403, "You can delete only your own posts"));
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    next(err);
  }
};


export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("userId", "username profilePic")            // author info
      .populate("comments.userId", "username profilePic");  // commenter info

    if (!post) return next(createError(404, "Post not found"));
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

// REPLY to a comment
export const addReply = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const post = await Post.findById(req.params.id);
    if (!post) return next(createError(404, "Post not found"));

    // find the comment by its _id
    const comment = post.comments.id(commentId);
    if (!comment) return next(createError(404, "Comment not found"));

    // push new reply
    comment.replies.push({
      userId: req.user.id,
      text: req.body.text,
    });

    await post.save();
    // return the newly added reply (last in array)
    const newReply = comment.replies[comment.replies.length - 1];
    res.status(201).json(newReply);
  } catch (err) {
    next(err);
  }
};
