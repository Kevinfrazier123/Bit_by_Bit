import User from "../models/User.js";
import { createError } from "../utils/error.js";

export const updateUser = async (req,res,next)=>{
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
}
export const deleteUser = async (req,res,next)=>{
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
}
export const getUser = async (req,res,next)=>{
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}
export const getUsers = async (req,res,next)=>{
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

// PUT /users/:id/profile-pic
export const updateProfilePic = async (req, res, next) => {
  try {
    const userId = req.params.id;
    // only the user themselves (or an admin) can update
    if (req.user.id !== userId && !req.user.isAdmin) {
      return next(createError(403, "Not authorized"));
    }

    const user = await User.findById(userId);
    if (!user) return next(createError(404, "User not found"));

    // multer put the file on disk and set req.file.filename
    user.profilePic = `/uploads/${req.file.filename}`;
    const updated = await user.save();
    // remove sensitive fields
    const { password, ...safe } = updated._doc;
    res.status(200).json(safe);
  } catch (err) {
    next(err);
  }
};