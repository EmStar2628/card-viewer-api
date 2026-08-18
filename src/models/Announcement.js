import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["pinned", "notice", "changelog"],
    required: true
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  version: { type: String, default: "" },
  pinned: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model("Announcement", announcementSchema);