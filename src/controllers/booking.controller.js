// src/controllers/booking.controller.js
import Booking from "../models/booking.model.js";

/**
 * Create a booking (guest OR logged-in user)
 */
export const createBooking = async (req, res) => {
  try {
    const payload = req.body;

    // If user is authenticated, attach user ID
    if (req.user) {
      payload.user = req.user._id;
    }

    const booking = await Booking.create(payload);

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      bookingId: booking._id,
      booking,
    });

  } catch (err) {
    console.error("❌ createBooking:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while creating booking",
      error: err.message,
    });
  }
};

/**
 * Logged-in user gets ONLY their own bookings
 */
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await Booking
      .find({ user: userId })
      .sort({ createdAt: -1 });

    return res.json({ success: true, bookings });

  } catch (err) {
    console.error("❌ getUserBookings:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching bookings",
      error: err.message,
    });
  }
};

/**
 * Admin / SuperAdmin: Get ALL bookings with optional filters
 */
export const getAllBookings = async (req, res) => {
  try {
    const { status, brand, date } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (brand) filter["device.brand"] = brand;
    if (date) filter["appointment.date"] = date;

    const bookings = await Booking
      .find(filter)
      .populate("user", "firstName lastName email role")
      .sort({ createdAt: -1 });

    return res.json({ success: true, bookings });

  } catch (err) {
    console.error("❌ getAllBookings:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching all bookings",
      error: err.message,
    });
  }
};

/**
 * Admin updates only booking status
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["pending", "in-progress", "completed", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    return res.json({
      success: true,
      message: "Booking status updated",
      booking,
    });

  } catch (err) {
    console.error("❌ updateBookingStatus:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while updating status",
      error: err.message,
    });
  }
};

/**
 * Admin: Get single booking
 */
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking
      .findById(req.params.id)
      .populate("user", "firstName lastName email role");

    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    return res.json({ success: true, booking });

  } catch (err) {
    console.error("❌ getBookingById:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching booking",
      error: err.message,
    });
  }
};

/**
 * Admin: Update booking (notes, estimating cost, adjusting appointment)
 */
export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    return res.json({
      success: true,
      message: "Booking updated successfully",
      booking,
    });

  } catch (err) {
    console.error("❌ updateBooking:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while updating booking",
      error: err.message,
    });
  }
};

// User: get single booking (only if it belongs to them)
export const getUserBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    // Ensure user owns booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    return res.json({ success: true, booking });

  } catch (err) {
    console.error("❌ getUserBookingById:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching booking",
      error: err.message,
    });
  }
};
