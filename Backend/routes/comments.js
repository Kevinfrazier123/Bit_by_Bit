//Manages comments on posts, allowing users to reply or provide feedback.
import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello thi is comment endpoint");
});

export default router;