import mongoose from "mongoose";

const QRDesignSchema = new mongoose.Schema(
  {
    qrCodeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QRCode",
      required: true,
    },
    options: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.models.QRDesign || mongoose.model("QRDesign", QRDesignSchema);
