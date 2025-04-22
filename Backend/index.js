//  This is our entry point where we configure Express, 
// connect to your database, and set up middleware/routes.
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import commentsRoute from "./routes/comments.js";
import postsRoute from "./routes/posts.js";
import cookieParser from "cookie-parser";
import multer from "multer";

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:3000",   // your React dev URL
  credentials: true,                 // allow cookies to be sent
}));

const connect = async () => {
try {
    await mongoose.connect(process.env.MONGO);
    //console.log("Connected to MongoDB");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
  });
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });

  connect();
  
 

  //middlewares, these are the different routes
  // important to add this 
  app.use(cookieParser());
  app.use(express.json());
  app.use("/auth", authRoute);
  app.use("/users", usersRoute);
  app.use("/comments", commentsRoute);
  app.use("/posts", postsRoute);
  // serve /uploads as static
  app.use("/uploads", express.static("uploads"));

  // your CORS + cookieParser + json middleware…
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
  app.use(cookieParser());
  app.use(express.json());
    //app.use(/..., .....);
  

  if (process.env.NODE_ENV !== "test") {
      app.listen(8800, () => {
        console.log("Connected to Backend")
      });
    }

export default app;