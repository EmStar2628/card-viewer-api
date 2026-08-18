import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  // 從 Header 拿 token
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "請先登入" });

  const token = header.split(" ")[1]; // "Bearer xxxxx" → 取後面那段
  if (!token) return res.status(401).json({ message: "請先登入" });

  try {
    // 驗證 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 把使用者資訊掛到 req 上，路由裡可以直接用
    next();             // 繼續往下執行
  } catch {
    res.status(401).json({ message: "Token 無效或已過期" });
  }
}