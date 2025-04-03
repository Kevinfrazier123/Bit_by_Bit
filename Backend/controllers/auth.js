//When to use it: When you need to decide 
// what happens when an endpoint is hit—like validating input, 
// processing data, or calling the database.
import User from "../models/User.js"
import bcrypt from "bcryptjs"
import createError from "http-errors";
import jwt from "jsonwebtoken";
const { JsonWebTokenError } = jwt;


export const register = async (req,res,next)=>{
    try {
        // hashing function for MongoDb
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        // Store hash in your password DB

        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hash,

        });
        
        await newUser.save();
        res.status(200).send("User has been created");
        
    } catch (err) {
        next(err);
    };
};
export const login = async (req,res,next)=>{
    try {
        const user = await User.findOne({username: req.body.username});
        if(!user) return next(createError(404, "User not found"));

        const isPasswordCorrect = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if(!isPasswordCorrect) 
            return next(createError(404, "Wrong password or username"));

        const token = jwt.sign({id:user._id,isAdmin: user._doc.isAdmin}, process.env.JWT); //When your password is correct, the server gives you a "key" (JWT token) 
        // that lets you access protected parts of the website 
        // without having to re-enter your password 

        const {password, isAdmin, ...otherDetails} = user._doc; //takes aways password from response in thundercloud
        res
        .cookie("access_token", token, {
            httpOnly: true,
        })
        .status(200)
        .json({...otherDetails});
    }   catch (err) {
        next(err);
    }
};