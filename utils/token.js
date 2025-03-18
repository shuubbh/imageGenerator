import jwt from 'jsonwebtoken';

// Function to generate a JWT token for a user
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',  // Set token expiration (e.g., 30 days)
  });
};

export default generateToken;
