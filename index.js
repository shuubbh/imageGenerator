import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";  // Import path module

import generateImageRoute from "./routes/GenerateImage.js";
import posts from "./routes/Post.js";
import userRoute from "./routes/userRoute.js";

dotenv.config();

const app = express();

// Use cookie-parser middleware
app.use(express.urlencoded({ extended: true })); // for form data
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

// Use CORS and parse JSON request body
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL (if needed)
    credentials: true,
  })
);

// Register routes
app.use("/api/user/", userRoute);
app.use("/api/generateImage/", generateImageRoute);
app.use("/api/post/", posts);

// ✅ Serve React Frontend
const __dirname = path.resolve(); // Ensure __dirname is defined
app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

// MongoDB Connection
const connectDB = () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
      console.error("Failed to connect with MongoDB");
      console.error(err);
    });
};

// Start server
const startServer = async () => {
  try {
    connectDB();
    app.listen(8080, () => console.log("Server started on port 8080"));
  } catch (error) {
    console.log(error);
  }
};

startServer();
