// src/routes/user.route.js
import express from "express";
import { getProfile, updateProfile, getUserBookings } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// optional: user bookings endpoint
router.get("/bookings", protect, getUserBookings);

export default router;
