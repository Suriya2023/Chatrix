import jwt from 'jsonwebtoken';

/**
 * Generates JWT token and sets it in an HTTP-only cookie.
 * Also logs the token temporarily to the console if in development mode.
 * 
 * @param {string} userId 
 * @param {object} res 
 * @returns {string} token
 */
export const generateToken = (userId, res) => {
  // Generate JWT
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  // Set cookie securely
  res.cookie("jwt", token, {
    httpOnly: true,                               
    secure: process.env.NODE_ENV !== "development",  
    sameSite: "Strict",                          
    maxAge: 7 * 24 * 60 * 60 * 1000               
  });

   
  if (process.env.NODE_ENV === "development") {
    console.log("🔐 JWT Token (temporary):", token);
  }

  return token;
};
