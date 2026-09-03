import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    plan: {
      type: String,
      enum: ["free", "pro", "business"],
      default: "free",
    },
    // Extended profile fields
    company: { type: String, default: "" },
    jobTitle: { type: String, default: "" },
    avatar: { type: String, default: "" },
    timezone: { type: String, default: "UTC" },
    language: { type: String, default: "en" },
    notifications: {
      emailScans: { type: Boolean, default: true },
      emailWeeklyReport: { type: Boolean, default: true },
      emailProduct: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
