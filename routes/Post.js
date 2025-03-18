import express from "express";
import { createPost, deletePost, getAllPosts } from "../controllers/Posts.js";
import protect from '../middlewares/protect.js';  // Using import for protect middleware
const router = express.Router();

router.get("/", getAllPosts);
router.post("/",protect,createPost);
router.delete("/delete/:postId",protect,deletePost);

export default router;