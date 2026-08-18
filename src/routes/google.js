import express from "express";
import passport from "../middleware/passport.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const FRONTEND_URL = process.env.NODE_ENV === "production"
  ? "https://card-viewer-umber.vercel.app"
  : "http://localhost:5173";

// ===== 導向 Google 登入頁 =====
router.get("/", passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false
}));

// ===== Google 登入完成後的 callback =====
router.get("/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${FRONTEND_URL}/login?error=1` }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user._id, username: req.user.username, isAdmin: req.user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.redirect(`${FRONTEND_URL}/login?token=${token}&username=${encodeURIComponent(req.user.username)}&isAdmin=${req.user.isAdmin}`);
  }
);


export default router;