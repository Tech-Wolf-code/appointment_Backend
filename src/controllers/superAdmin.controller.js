// src/controllers/superAdmin.controller.js
import User from "../models/user.model.js";

/**
 * List all admins
 */
export const listAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: { $in: ["admin", "superAdmin"] } }).select("-password").sort({ createdAt: -1 });
    res.json({ admins });
  } catch (err) {
    console.error("listAdmins:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * List all users (for super admin)
 */
export const listAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    console.error("listAllUsers:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Promote user to admin
 */
export const promoteToAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { role: "admin" }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Promoted to admin", user });
  } catch (err) {
    console.error("promoteToAdmin:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Demote admin to user (but not superAdmin)
 */
export const demoteFromAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent demoting a superAdmin accidentally
    if (user.role === "superAdmin") return res.status(403).json({ message: "Cannot demote a superAdmin" });

    user.role = "user";
    await user.save();
    res.json({ message: "User demoted from admin", user: { id: user._id, role: user.role } });
  } catch (err) {
    console.error("demoteFromAdmin:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
