import express from "express";
import Announcement from "../models/Announcement.js";
import auth from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// ===== 取得所有公告 =====
router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ pinned: -1, createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

// ===== 新增公告（僅管理員）=====
router.post("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user.isAdmin) return res.status(403).json({ message: "沒有權限" });

    const { type, title, content, version, pinned } = req.body;
    const announcement = await Announcement.create({
      type, title, content,
      version: version || "",
      pinned: pinned || false
    });
    res.json(announcement);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

// ===== 編輯公告（僅管理員）=====
router.put("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user.isAdmin) return res.status(403).json({ message: "沒有權限" });

    const { type, title, content, version, pinned } = req.body;
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { type, title, content, version, pinned },
      { new: true }
    );
    if (!announcement) return res.status(404).json({ message: "找不到公告" });
    res.json(announcement);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

// ===== 刪除公告（僅管理員）=====
router.delete("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user.isAdmin) return res.status(403).json({ message: "沒有權限" });

    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: "刪除成功" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

export default router;