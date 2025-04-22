// Backend/routes/posts.js
// Handles community forum posts: create, read, like, comment, delete.

import express from "express";
import multer from "multer";
import {
  createPost,
  toggleLike,
  addComment,
  addReply,
  getAllPosts,
  getPost,
  deletePost,
} from "../controllers/post.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

// Multer setup: store uploads under /uploads with timestamped filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// GET all posts (requires login)
router.get("/", verifyToken, getAllPosts);
router.get("/:id", verifyToken, getPost);        
// CREATE post (with optional image + attachment)
router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "attachment", maxCount: 1 },
  ]),
  createPost
);

// LIKE / UNLIKE a post
router.put("/:id/like", verifyToken, toggleLike);

// ADD a comment
router.post("/:id/comment", verifyToken, addComment);
router.post("/:id/comment/:commentId/reply", verifyToken, addReply);

// DELETE a post
router.delete("/:id", verifyToken, deletePost);

export default router;
