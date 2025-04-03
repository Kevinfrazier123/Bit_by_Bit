// routes for user authentication (signup, login, logout) using JWT.
import express from "express";
import { register } from "../controllers/auth.js";
import { login } from "../controllers/auth.js"; // Import from login

const router = express.Router();

router.post("/register", register)
router.post("/login", login)

export default router;