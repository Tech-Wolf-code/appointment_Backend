// src/routes/auth.route.js
import express from "express";
import { registerUser, loginUser, refreshToken, logoutUser } from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken); // expects cookie or body.refreshToken
router.post("/logout", logoutUser);

export default router;
