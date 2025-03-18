import express from 'express';
import { registerUser, loginUser, logoutUser, getUserPosts } from '../controllers/authControllers.js';
import protect from '../middlewares/protect.js';  // Using import for protect middleware

const router = express.Router();

// Route for registering a user
router.post('/register',registerUser);

// Route for logging in a user
router.post('/login', loginUser);

// Route for logging out a user
router.get('/logout',protect, logoutUser);

router.get("/get/posts",protect,getUserPosts)
export default router;
