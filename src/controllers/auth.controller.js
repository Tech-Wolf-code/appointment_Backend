import User from "../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  setTokenCookies,
} from "../utils/generateTokens.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password)
      return res.status(400).json({ message: "Missing required fields" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // ❗ FIXED – ONLY set refresh token cookie
    setTokenCookies(res, { refreshToken });

    return res.json({
      message: "User registered",
      accessToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Missing credentials" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const match = await user.matchPassword(password);
    if (!match)
      return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // ❗ FIXED – ONLY set refresh token cookie
    setTokenCookies(res, { refreshToken });

    return res.json({
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token)
      return res.status(401).json({ message: "No refresh token provided" });

    let payload;

    try {
      payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const user = await User.findById(payload.id);
    if (!user)
      return res.status(401).json({ message: "User not found" });

    if (user.isBlocked)
      return res.status(403).json({ message: "User is blocked" });

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // ❗ FIXED – Set new refresh token cookie
    setTokenCookies(res, { refreshToken: newRefreshToken });

    return res.json({
      message: "Token refreshed",
      accessToken: newAccessToken,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });

    return res.json({ message: "Logged out" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
