import express from "express";
import passport from "../middleware/passport.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// ===== 導向 Google 登入頁 =====
router.get("/", passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false
}));

// ===== Google 登入完成後的 callback =====
router.get("/callback",
  passport.authenticate("google", { session: false, failureRedirect: "https://card-viewer-umber.vercel.app/login?error=1" }),
  (req, res) => {
    // 發 JWT
    const token = jwt.sign(
      { userId: req.user._id, username: req.user.username, isAdmin: req.user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 把 token 和 username 帶回前端
    res.redirect(`https://card-viewer-umber.vercel.app/login?token=${token}&username=${encodeURIComponent(req.user.username)}&isAdmin=${req.user.isAdmin}`);
  }
);

export default router;