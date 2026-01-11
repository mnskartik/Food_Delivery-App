const router = require("express").Router();
const { getCategories, getMenuByCategory } = require("../controllers/menuController");
const MenuItem = require("../models/MenuItem");

router.get("/categories", getCategories);
router.get("/category/:id", getMenuByCategory);

// ✅ THIS is missing
router.get("/restaurant/:id", async (req, res) => {
  const items = await MenuItem.find({ restaurant: req.params.id }).populate("category");
  res.json(items);
});

module.exports = router;
