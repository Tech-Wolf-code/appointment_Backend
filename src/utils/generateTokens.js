// src/utils/generateTokens.js
import jwt from "jsonwebtoken";

/** Generate short-lived access token */
export function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user._id?.toString() || user._id,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET, // FIXED
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" } // FIXED
  );
}

/** Generate long-lived refresh token */
export function generateRefreshToken(user) {
  return jwt.sign(
    {
      id: user._id?.toString() || user._id,
    },
    process.env.JWT_REFRESH_SECRET, // FIXED
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" } // FIXED
  );
}

/** Set HttpOnly refresh cookie */
export function setTokenCookies(res, { accessToken, refreshToken }) {
  const secure = process.env.NODE_ENV === "production";

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge: parseDurationToMs(process.env.REFRESH_TOKEN_EXPIRY || "7d"),
    path: "/api/auth/refresh",
  });
}

/** Convert "15m", "7d", "1h" to milliseconds */
function parseDurationToMs(str) {
  const match = /^(\d+)([smhd])$/.exec(str);
  if (!match) return 0;

  const value = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case "s": return value * 1000;
    case "m": return value * 60 * 1000;
    case "h": return value * 60 * 60 * 1000;
    case "d": return value * 24 * 60 * 60 * 1000;
    default: return 0;
  }
}
