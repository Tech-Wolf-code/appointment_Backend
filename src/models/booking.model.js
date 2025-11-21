// src/models/booking.model.js
import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    // Customer info
    customer: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, required: true, trim: true },
      countryCode: { type: String, default: "+91", trim: true },
    },

    // Device info
    device: {
      brand: { type: String, required: true, trim: true },
      deviceType: { type: String, required: true, trim: true },
      otherDevice: { type: String, default: "", trim: true },
      model: { type: String, default: "", trim: true },
    },

    // Issue info
    issue: {
      issues: [{ type: String, trim: true }],
      otherIssue: { type: String, default: "", trim: true },
      description: { type: String, default: "", trim: true },
    },

    // Appointment
    appointment: {
      address: { type: String, required: true, trim: true },
      date: { type: String, required: true, trim: true }, // ISO date string or yyyy-mm-dd
      timeSlot: { type: String, required: true, trim: true }, // "Morning"/"Manual"/etc or manualTime
      manualTime: { type: String, default: "", trim: true }, // hh:mm if manual
    },

    // Booking metadata
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "cancelled"],
      default: "pending",
    },

    // Reference to user who created it (if registered)
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },

    // Optional admin notes, cost estimate, etc.
    adminNotes: { type: String, default: "" },
    estimate: { type: Number, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
