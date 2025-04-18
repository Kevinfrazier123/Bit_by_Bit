// //Handles community forum posts, including creating, reading, updating, 
// // and deleting scam reports or discussion posts.

// import express from "express";

// const router = express.Router();

// router.get("/", (req, res) => {
//     res.send("Hello thi is post endpoint");
// });

// export default router;

// Backend/routes/posts.js
import express from "express";
import {
  createPost,
  toggleLike,
  addComment,
  getAllPosts,
} from "../controllers/post.js";
import { verifyToken } from "../utils/verifyToken.js";   // already exists :contentReference[oaicite:2]{index=2}&#8203;:contentReference[oaicite:3]{index=3}

const router = express.Router();

router.get("/", verifyToken, getAllPosts);
router.post("/", verifyToken, createPost);
router.put("/:id/like", verifyToken, toggleLike);
router.post("/:id/comment", verifyToken, addComment);

export default router;
