import Post from "../models/Post.js";
import * as dotenv from "dotenv";
import { createError } from "../error.js";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/userModel.js";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all posts
export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({});
    return res.status(200).json({ success: true, data: posts });
  } catch (error) {
    return next(
      createError(
        error.status,
        error?.response?.data?.error.message || error.message
      )
    );
  }
};

// Create new post
export const createPost = async (req, res, next) => {
  try {
    // Find the user
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const { name, prompt, photo } = req.body;
    const photoUrl = await cloudinary.uploader.upload(photo);
    const newPost = await Post.create({
      name,
      prompt,
      photo: photoUrl.secure_url,
    });
    user.posts.push(newPost._id);
    await user.save();  // Save the updated user document
    return res.status(200).json({ success: true, data: newPost,message:"Post is Posted in Community" });
  } catch (error) {
    console.log(error);
    return next(
      createError(error.status, error?.response?.data?.error.message)
    );
  }
};

// Delete a post
export const deletePost = async (req, res, next) => {
  const { postId } = req.params; // Get postId from params
  const userId = req.user.id; // Get userId from req.user.id

  try {
    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Check if the user is the owner of the post
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.posts.includes(postId)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post",
      });
    }

    // Remove the post from Cloudinary
    const photoPublicId = post.photo.split('/').pop().split('.')[0]; // Extract the public ID from the photo URL
    await cloudinary.uploader.destroy(photoPublicId);

    // Remove the post from the database
    await Post.findByIdAndDelete(postId);

    // Remove the post from the user's posts array
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return next(
      createError(
        error.status,
        error?.response?.data?.error.message || error.message
      )
    );
  }
};
