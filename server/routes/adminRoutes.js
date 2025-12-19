const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { getAllOrders, updateOrderStatus } = require("../controllers/adminController");

router.get("/orders", auth, admin, getAllOrders);
router.patch("/orders/:id/status", auth, admin, updateOrderStatus);

module.exports = router;
