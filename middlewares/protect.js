import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protect = async (req, res, next) => {
  let token;
  if (req.cookies.token) {
    try {
      token = req.cookies.token;
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      // Attach user to the request
      req.user = await User.findById(decoded.id);

      next();// Proceed to the next middleware/controller
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.log("No token found in cookies");
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};




export default protect;
