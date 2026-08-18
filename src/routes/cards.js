import express from "express";
import Card from "../models/Card.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// ===== 新增卡片（需要登入）=====
router.post("/", auth, async (req, res) => {
  try {
    const { cardCode, parsedName, element, race, series, imageSource, skillTags, description } = req.body;

    const card = await Card.create({
      owner: req.user.userId,
      cardCode,
      parsedName,
      element,
      race,
      series,
      imageSource: imageSource || "",
      skillTags: skillTags || [],
      description: description || ""
    });

    res.json(card);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

// ===== 取得所有卡片（不需要登入）=====
router.get("/", async (req, res) => {
  try {
    const { q, element, race, series, tags } = req.query;

    const filter = {};

    if (q) filter.$text = { $search: q };
    if (element) filter.element = element;
    if (race) filter.race = race;
    if (series) filter.series = series;

    // tags 是逗號分隔的字串，例如 "引爆符石,追打"
    if (tags) {
      const tagList = tags.split(",").filter(Boolean);
      if (tagList.length > 0) filter.skillTags = { $all: tagList };
    }

    const cards = await Card.find(filter)
      .populate("owner", "username")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(cards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

// ===== 取得單張卡片 =====
router.get("/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id)
      .populate("owner", "username");

    if (!card) return res.status(404).json({ message: "找不到卡片" });

    res.json(card);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

// ===== 刪除卡片（只有本人能刪）=====
router.delete("/:id", auth, async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: "找不到卡片" });

    // 確認是本人
    if (card.owner.toString() !== req.user.userId)
      return res.status(403).json({ message: "沒有權限" });

    await card.deleteOne();
    res.json({ message: "刪除成功" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

export default router;