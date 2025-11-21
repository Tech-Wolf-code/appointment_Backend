// src/controllers/user.controller.js
import User from "../models/user.model.js";
import Booking from "../models/booking.model.js";

/**
 * Get profile for currently authenticated user
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error("getProfile:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Update profile (firstName, lastName, email) - user can update self
 */
export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    // Prevent role changes via this endpoint
    delete updates.role;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password");
    res.json({ message: "Profile updated", user });
  } catch (err) {
    console.error("updateProfile:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * User can see their bookings (delegates to booking.controller getUserBookings)
 * For simplicity, also allow this endpoint.
 */
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    console.error("getUserBookings (user controller):", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
