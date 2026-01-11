const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant");

// GET all restaurants
router.get("/", async (req, res) => {
  const restaurants = await Restaurant.find();
  res.json(restaurants);
});

// GET single restaurant
router.get("/:id", async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) return res.status(404).json({ msg: "Restaurant not found" });
  res.json(restaurant);
});

module.exports = router;
