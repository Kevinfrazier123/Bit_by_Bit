//Handles community forum posts, including creating, reading, updating, 
// and deleting scam reports or discussion posts.

import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello thi is post endpoint");
});

export default router;