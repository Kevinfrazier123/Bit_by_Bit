//When to use it: When you need to decide 
// what happens when an endpoint is hit—like validating input, 
// processing data, or calling the database.
import User from "../models/User.js"
import bcrypt from "bcryptjs"
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
const { JsonWebTokenError } = jwt;


export const register = async (req, res, next) => {
    try {
      // ✅ Password length validation first
      if (!req.body.password || req.body.password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }
  
      // Hash the password
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
  
      // Create new user
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
      });
  
      await newUser.save();
      res.status(200).send("User has been created");
    } catch (err) {
      next(err);
    }
  };
  
export const login = async (req, res, next) => {
    try {
      
      const { username, password } = req.body;
  
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
  
      const user = await User.findOne({ username });
      if (!user) return next(createError(404, "User not found"));
  
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) return next(createError(401, "Wrong password"));
  
      const token = jwt.sign(
        { id: user._id, isAdmin: user._doc.isAdmin },
        process.env.JWT
      );
  
      const { password: pass, isAdmin, ...otherDetails } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json({ ...otherDetails });
    } catch (err) {
      next(err);
    }
  };