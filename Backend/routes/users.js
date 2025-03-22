//Manages user profile actions, such as retrieving or updating profile information.
import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello thi is auth endpoint");
});

export default router;