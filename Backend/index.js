//  This is our entry point where we configure Express, 
// connect to your database, and set up middleware/routes.
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import commentsRoute from "./routes/comments.js";
import postsRoute from "./routes/posts.js";


dotenv.config();
const app = express();


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
  app.use(express.json())
  app.use("/auth", authRoute);
  app.use("/users", usersRoute);
  app.use("/comments", commentsRoute);
  app.use("/posts", postsRoute);
  //app.use(/..., .....);

app.listen(8800, () => {
    console.log("Connected to Backend")
})