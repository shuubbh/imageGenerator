import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import generateToken from '../utils/token.js';

// Register User
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).send({ message: 'User already exists' });
  }


  // Create new user with hashed password
  const user = await User.create({
    name,
    email,
    password
  });

  if (user) {
    const token = generateToken(user._id);

    // Set the token in cookies (for the client)
    res.cookie('token', token, {
      httpOnly: true,      // Prevents client-side access
      maxAge: 30 * 24 * 60 * 60 * 1000,  // Cookie expiry time (e.g., 30 days)
    });

    res.status(201).send({data:{
      _id: user._id,
      name: user.name,
      email: user.email,
      posts:user.posts
    },message: `User Register`});
  } else {
    res.status(400).send({ message: 'Invalid user data' });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  // Check if user exists and passwords match
  if (user) {
    const token = generateToken(user._id);

    // Set the token in cookies
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expiry time
    });

    res.send({data:{
      _id: user._id,
      name: user.name,
      email: user.email,
      posts:user.posts
    },message: `Welcome ${user.name}`});
  } else {
    res.status(401).send({ message: 'Invalid email or password' });
  }
};

// Logout User (clear the cookie)
export const logoutUser = (req, res) => {
  res.clearCookie('token');  // Clear the JWT token cookie
  res.send({ success:true ,message:"User Logged Out Successfully" });
};

// Get User's Posts
export const getUserPosts = async (req, res) => {
  const userId = req.user.id;  // From protect middleware

  // Find the user with their posts
  const user = await User.findById(userId).populate('posts');

  if (user) {
    res.send({posts:user.posts,success:true}); 
  } else {
    res.status(404).send({ message: 'User not found' });
  }
};
