const Category = require("../models/Category");
const MenuItem = require("../models/MenuItem");

exports.getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

exports.getMenuByCategory = async (req, res) => {
  const items = await MenuItem.find({ category: req.params.id });
  res.json(items);
};
