import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  cardCode: {
    type: String,
    required: true
  },
  // 從卡片碼解析出來的欄位，用來搜尋
  parsedName: String,
  element: String,   // w f t l d
  race: String,      // G E H A D S M
  series: String,
  imageSource: {
    type: String,
    default: ""
  },
  imageUrl: {
    type: String,
    default: ""
  },
  imageCrop: {
    type: new mongoose.Schema({
      x: { type: Number, default: 50 },
      y: { type: Number, default: 50 },
      zoom: { type: Number, default: 1 }
    }, { _id: false }),
    default: null
  },
  description: {
    type: String,
    default: ""
  },
  skillTags: {
    type: [String],
    default: []
  },
  // 點讚數（快取，不用每次都 count）
  likeCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true   // 自動加 createdAt 和 updatedAt
});

// 建立搜尋索引
cardSchema.index({ parsedName: "text", series: "text" });
cardSchema.index({ element: 1, race: 1 });

export default mongoose.model("Card", cardSchema);