const router = require("express").Router();
const auth = require("../middleware/auth");
const { getCategories, getMenuByCategory } = require("../controllers/menuController");

router.get("/categories", getCategories);
router.get("/category/:id", getMenuByCategory);

module.exports = router;
