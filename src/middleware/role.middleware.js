// src/middleware/role.middleware.js

/**
 * requireRole takes an array or single role and checks req.user.role
 * Usage: requireRole("admin") or requireRole(["admin","superAdmin"])
 */
export const requireRole = (roles) => {
  if (!Array.isArray(roles)) roles = [roles];

  return (req, res, next) => {
    try {
      const userRole = req.user?.role;
      if (!userRole) return res.status(401).json({ message: "Not authorized" });

      if (!roles.includes(userRole)) return res.status(403).json({ message: "Insufficient permissions" });
      next();
    } catch (err) {
      console.error("requireRole middleware:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
};
