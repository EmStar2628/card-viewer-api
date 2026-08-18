import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// ===== 註冊 =====
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 檢查帳號是否已存在
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: "帳號已存在" });

    // 加密密碼
    const passwordHash = await bcrypt.hash(password, 10);

    // 建立使用者
    const user = await User.create({ username, passwordHash });

    res.json({ message: "註冊成功", userId: user._id });
  } catch (err) {
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

// ===== 登入 =====
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 找使用者
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "帳號或密碼錯誤" });

    // 比對密碼
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ message: "帳號或密碼錯誤" });

    // 發 JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, username: user.username, isAdmin: user.isAdmin });
  } catch (err) {
  console.error(err);
  res.status(500).json({ message: "伺服器錯誤" });
  }
});

export default router;