import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema({
  cardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Card",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: ["like", "comment"],
    required: true
  },
  content: String  // 只有 comment 才會用到
}, {
  timestamps: true
});

// 同一個人對同一張卡只能點一次讚
interactionSchema.index({ cardId: 1, userId: 1, type: 1 }, { unique: true, partialFilterExpression: { type: "like" } });

export default mongoose.model("Interaction", interactionSchema);