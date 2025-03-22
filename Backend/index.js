//  This is our entry point where we configure Express, 
// connect to your database, and set up middleware/routes.
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
const app = express();
dotenv.config();

const connect = async () => {
try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB");
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


  //middlewares, these are the different routes
  app.use("/auth", authRoute);
  app.use("/users", usersRoute);
  //app.use(/..., .....);

app.listen(8800, () => {
    console.log("Connected to Backend")
})