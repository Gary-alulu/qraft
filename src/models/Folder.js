import mongoose from "mongoose";

const FolderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: "#1E3A5F",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Folder || mongoose.model("Folder", FolderSchema);
