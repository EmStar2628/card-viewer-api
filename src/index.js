import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import passport from "./middleware/passport.js";
import { initPassport } from "./middleware/passport.js";
import authRoutes from "./routes/auth.js";
import cardRoutes from "./routes/cards.js";
import interactionRoutes from "./routes/interactions.js";
import googleRoutes from "./routes/google.js";

const app = express();

// dotenv 載入後才初始化 passport
initPassport();

app.use(cors({
  origin: ["http://localhost:5173", "https://card-viewer-umber.vercel.app"]
}));
app.use(express.json());
app.use(passport.initialize());

app.get("/", (req, res) => res.json({ message: "API 運作中" }));
app.use("/api/auth", authRoutes);
app.use("/api/auth/google", googleRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/interactions", interactionRoutes);

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB 連線成功");
    app.listen(PORT, () => console.log(`伺服器跑在 http://localhost:${PORT}`));
  })
  .catch(err => console.error("MongoDB 連線失敗", err));