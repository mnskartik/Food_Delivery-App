const Restaurant = require("../models/Restaurant");

exports.getRestaurants = async (req, res) => {
  try {
    const { search, rating, veg, distance } = req.query;

    let filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    if (veg === "true") {
      filter.isVeg = true;
    }

    if (distance) {
      filter.distance = { $lte: Number(distance) };
    }

    const restaurants = await Restaurant.find(filter).sort({
      rating: -1,
    });

    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch restaurants" });
  }
};
