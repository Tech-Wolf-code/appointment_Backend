// src/routes/admin.route.js
import express from "express";
import { listUsers, toggleBlockUser, adminListBookings,getUserBookingsAdmin } from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = express.Router();

// All routes protected and allowed to admin + superAdmin
router.get("/users", protect, requireRole(["admin", "superAdmin"]), listUsers);
router.patch("/users/:id/toggle-block", protect, requireRole(["admin", "superAdmin"]), toggleBlockUser);

// bookings for admin
router.get("/bookings", protect, requireRole(["admin", "superAdmin"]), adminListBookings);
router.get("/users/:id/bookings", protect, requireRole(["admin", "superAdmin"]), getUserBookingsAdmin);

export default router;
