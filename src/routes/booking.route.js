// src/routes/booking.route.js
import express from "express";
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  getBookingById,
  updateBooking,
    getUserBookingById,
} from "../controllers/booking.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = express.Router();

// create booking (authenticated users)
router.post("/", protect, createBooking);

// user: get own bookings
router.get("/me", protect, getUserBookings);

// admin: list all bookings
router.get("/admin", protect, requireRole(["admin", "superAdmin"]), getAllBookings);

// admin: get booking by id
router.get("/admin/:id", protect, requireRole(["admin", "superAdmin"]), getBookingById);

// admin: update booking
router.patch("/admin/:id", protect, requireRole(["admin", "superAdmin"]), updateBooking);

// admin: update status
router.patch("/admin/:id/status", protect, requireRole(["admin", "superAdmin"]), updateBookingStatus);

// User single booking
router.get("/:id", protect, getUserBookingById);


export default router;
