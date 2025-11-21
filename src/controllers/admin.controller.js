// src/controllers/admin.controller.js
import User from "../models/user.model.js";
import Booking from "../models/booking.model.js";

/**
 * List users (admin)
 */
export const listUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    console.error("listUsers:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Toggle block/unblock user
 */
export const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ message: user.isBlocked ? "User blocked" : "User unblocked", user: { id: user._id, isBlocked: user.isBlocked } });
  } catch (err) {
    console.error("toggleBlockUser:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Admin: list bookings
 */
export const adminListBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user", "firstName lastName email").sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    console.error("adminListBookings:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const getUserBookingsAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const bookings = await Booking.find({ user: id })
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (err) {
    console.error("getUserBookingsAdmin:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
