// src/routes/superAdmin.route.js
import express from "express";
import { listAdmins, listAllUsers, promoteToAdmin, demoteFromAdmin } from "../controllers/superAdmin.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/admins", protect, requireRole("superAdmin"), listAdmins);
router.get("/users", protect, requireRole("superAdmin"), listAllUsers);
router.patch("/promote/:id", protect, requireRole("superAdmin"), promoteToAdmin);
router.patch("/demote/:id", protect, requireRole("superAdmin"), demoteFromAdmin);

export default router;
