// routes for user authentication (signup, login, logout) using JWT.
import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello thi is auth endpoint");
});

export default router;