import cloudinary from '../DataBase/clloudnary.js';
import { generateToken } from '../DataBase/token.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

// ✅ Signup
export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ fullName, email, password: hashedPassword });
    await newUser.save();

    const token = generateToken(newUser._id, res);

    // 🧪 TEMP log for development
    if (process.env.NODE_ENV === 'development') {
      console.log("🔐 Token (Signup):", token);
    }

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id, res);

    // 🧪 TEMP log for development
    if (process.env.NODE_ENV === 'development') {
      console.log("🔐 Token (Login):", token);
    }

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Logout
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: "Strict",
      secure: process.env.NODE_ENV !== "development"
    });

    // 🧪 TEMP log for development
    if (process.env.NODE_ENV === 'development') {
      console.log("✅ User logged out. Cookie cleared.");
    }

    res.status(200).json({ message: "Logout successfully" });
  } catch (err) {
    console.error("Logout error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Check Auth
export const checkAuth = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🧪 TEMP log for development
    if (process.env.NODE_ENV === 'development') {
      console.log("🔎 Authenticated User:", req.user);
    }

    res.status(200).json(req.user);
  } catch (error) {
    console.error("Auth check error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
