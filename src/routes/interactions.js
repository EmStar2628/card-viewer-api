import express from "express";
import Interaction from "../models/Interaction.js";
import Card from "../models/Card.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// ===== 點讚 / 取消讚 =====
router.post("/:cardId/like", auth, async (req, res) => {
  try {
    const { cardId } = req.params;
    const userId = req.user.userId;

    const existing = await Interaction.findOne({ cardId, userId, type: "like" });

    if (existing) {
      // 已經讚過，取消讚
      await existing.deleteOne();
      await Card.findByIdAndUpdate(cardId, { $inc: { likeCount: -1 } });
      res.json({ liked: false });
    } else {
      // 新增讚
      await Interaction.create({ cardId, userId, type: "like" });
      await Card.findByIdAndUpdate(cardId, { $inc: { likeCount: 1 } });
      res.json({ liked: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

// ===== 新增留言 =====
router.post("/:cardId/comment", auth, async (req, res) => {
  try {
    const { cardId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) return res.status(400).json({ message: "留言不能為空" });

    const comment = await Interaction.create({
      cardId,
      userId: req.user.userId,
      type: "comment",
      content: content.trim()
    });

    // 回傳時帶上 username
    await comment.populate("userId", "username");

    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

// ===== 取得某張卡的留言 =====
router.get("/:cardId/comments", async (req, res) => {
  try {
    const comments = await Interaction.find({
      cardId: req.params.cardId,
      type: "comment"
    })
      .populate("userId", "username")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

// ===== 刪除留言（只有本人能刪）=====
router.delete("/comment/:commentId", auth, async (req, res) => {
  try {
    const comment = await Interaction.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "找不到留言" });

    if (comment.userId.toString() !== req.user.userId)
      return res.status(403).json({ message: "沒有權限" });

    await comment.deleteOne();
    res.json({ message: "刪除成功" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

export default router;