import mongoose from "mongoose";

const ScanSchema = new mongoose.Schema(
  {
    qrCodeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QRCode",
      required: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    deviceType: {
      type: String,
      enum: ["desktop", "mobile", "tablet", "unknown"],
      default: "unknown",
    },
    browser: {
      type: String,
    },
    os: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Scan || mongoose.model("Scan", ScanSchema);
