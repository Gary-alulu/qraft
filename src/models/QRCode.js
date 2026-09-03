import mongoose from "mongoose";

const QRCodeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: "Untitled QR Code",
    },
    type: {
      type: String,
      required: true,
      default: "website",
    },
    // The raw data or configuration for the content (e.g. { url: "..." } or { vcard: {...} })
    contentData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    isDynamic: {
      type: Boolean,
      default: false,
    },
    shortSlug: {
      type: String,
      unique: true,
      sparse: true,
    },
    destinationUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "paused", "archived"],
      default: "active",
    },
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
    },
    // Reference to the design settings
    designId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QRDesign",
    },
    scansCount: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

export default mongoose.models.QRCode || mongoose.model("QRCode", QRCodeSchema);
