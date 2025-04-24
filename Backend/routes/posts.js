// backend/routes/posts.js
// Handles community forum posts: create, read, like, comment, delete,
// now with automated risk scoring on post creation.

import express from "express";
import multer from "multer";
import { verifyToken } from "../utils/verifyToken.js";
import computeRisk from "../utils/computeRisk.js";
import {
  createPost,
  toggleLike,
  addComment,
  addReply,
  getAllPosts,
  getPost,
  deletePost,
} from "../controllers/post.js";

const router = express.Router();

// Multer setup: store uploads under /uploads with timestamped filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename:    (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// GET all posts (requires login)
router.get("/", verifyToken, getAllPosts);
router.get("/:id", verifyToken, getPost);

// CREATE post (with optional image + attachment)
// — before calling createPost, compute riskLevel & riskScores and attach to req.body
router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "image",      maxCount: 1 },
    { name: "attachment", maxCount: 1 },
  ]),
  async (req, res, next) => {
    try {
      const description = req.body.description || "";
      // 1. Extract URLs from description
      const urls = description.match(/https?:\/\/\S+/g) || [];
      // 2. Build userMeta and feedbackMeta for risk computation
      const userMeta = { createdAt: req.user.createdAt };
      const feedbackMeta = { upVotes: 0, downVotes: 0 };
      // 3. Compute risk
      const { riskLevel, riskScores } = await computeRisk({
        text:        description,
        urls,
        userMeta,
        feedbackMeta,
      });


      req.body.riskLevel  = riskLevel;
      req.body.riskScores = riskScores;
      
      // 4. Attach to req.body for controller
      req.body.riskLevel  = riskLevel;
      req.body.riskScores = riskScores;
      next();
    } catch (err) {
      next(err);
    }
  },
  createPost
);

// LIKE / UNLIKE a post
router.put("/:id/like", verifyToken, toggleLike);

// ADD a comment
router.post("/:id/comment",                       verifyToken, addComment);
router.post("/:id/comment/:commentId/reply",      verifyToken, addReply);

// DELETE a post
router.delete("/:id", verifyToken, deletePost);

export default router;
