// Backend/routes/users.js
// Manages user profile actions, such as retrieving or updating profile information.

import express from "express";
import multer from "multer";
import User from "../models/User.js";              // ← import User model
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  updateProfilePic,
} from "../controllers/user.js";
import { verifyToken, verifyUser, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// multer setup for profile image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// auth check routes
router.get("/checkauthentication", verifyToken, (req, res) => {
  res.send("Hello user, you are logged in");
});
router.get("/checkuser/:id", verifyUser, (req, res) => {
  res.send("Hello user, you are logged in and can delete your account");
});
router.get("/checkadmin/:id", verifyAdmin, (req, res) => {
  res.send("Hello user, you are logged in and can delete all accounts");
});

// NEW: Active users list
// GET /users/active → return all users with username & profilePic
router.get("/active", verifyToken, async (req, res, next) => {
  try {
    const users = await User.find()
      .select("username profilePic")
      .sort({ updatedAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

// profile picture upload
// PUT /users/:id/profile-pic
router.put(
  "/:id/profile-pic",
  verifyUser,
  upload.single("image"),
  updateProfilePic
);

// standard user CRUD
router.put("/:id", verifyUser, updateUser);
router.delete("/:id", verifyUser, deleteUser);
router.get("/:id", verifyUser, getUser);
router.get("/", verifyAdmin, getUsers);

export default router;
