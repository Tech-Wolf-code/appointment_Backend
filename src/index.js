import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // if you have this
import authRoutes from "./routes/auth.route.js"; // existing
import userRoutes from "./routes/user.route.js";
import bookingRoutes from "./routes/booking.route.js";
import adminRoutes from "./routes/admin.route.js";
import superAdminRoutes from "./routes/superAdmin.route.js";

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "https://appointment-frontend-three.vercel.app",
  "https://appointment-frontend-esjxxlyu7-rohits-projects-19c591c6.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (mobile apps, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());
app.use(cookieParser());

// existing auth routes
app.use("/api/auth", authRoutes);

// new routes
app.use("/api/users", userRoutes);          // /api/users/profile, /api/users/bookings
app.use("/api/bookings", bookingRoutes);    // /api/bookings, /api/bookings/me, /api/bookings/admin
app.use("/api/admin", adminRoutes);         // /api/admin/users, /api/admin/bookings
app.use("/api/super-admin", superAdminRoutes); // /api/super-admin/admins etc.

app.listen(process.env.PORT || 5000, () => console.log("Server running"));