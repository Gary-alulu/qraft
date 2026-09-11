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
      // Every dynamic QR must route through the /r/<slug> redirect engine to
      // be trackable. Enforce that invariant at the model layer so a dynamic
      // code can never be persisted without its tracking slug.
      validate: {
        validator(v) {
          return this.isDynamic ? !!v : true;
        },
        message: "Dynamic QR codes must have a shortSlug to be trackable.",
      },
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
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    scanabilityScore: {
      type: Number,
      default: 95,
    },
    campaign: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.QRCode || mongoose.model("QRCode", QRCodeSchema);
