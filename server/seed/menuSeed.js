const mongoose = require("mongoose");
require("dotenv").config();

const Category = require("../models/Category");
const MenuItem = require("../models/MenuItem");
const Restaurant = require("../models/Restaurant");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    // ❌ Clear old data
    await Category.deleteMany();
    await MenuItem.deleteMany();
    await Restaurant.deleteMany();

    // ✅ Create Categories
    const categories = await Category.insertMany([
      { name: "Burgers" },
      { name: "Pizza" },
      { name: "Drinks" },
      { name: "Desserts" },
    ]);

    const burgers = categories.find(c => c.name === "Burgers");
    const pizza = categories.find(c => c.name === "Pizza");
    const drinks = categories.find(c => c.name === "Drinks");
    const desserts = categories.find(c => c.name === "Desserts");

    // ✅ Create Restaurants
    const restaurants = await Restaurant.insertMany([
      {
        name: "Burger Palace",
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
        rating: 4.5,
        distance: 2.3,
        deliveryTime: 25,
        categories: ["Burgers", "Fast Food"],
      },
      {
        name: "Pizza Hub",
        image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143",
        rating: 4.2,
        distance: 3.1,
        deliveryTime: 30,
        categories: ["Pizza", "Italian"],
      },
      {
        name: "Sweet Treats",
        image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f",
        rating: 4.7,
        distance: 1.5,
        deliveryTime: 20,
        categories: ["Desserts"],
      },
    ]);

    const burgerRestro = restaurants[0];
    const pizzaRestro = restaurants[1];
    const dessertRestro = restaurants[2];

    // ✅ Create Menu Items
    await MenuItem.insertMany([
      {
        name: "Cheese Burger",
        price: 120,
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
        category: burgers._id,
        restaurant: burgerRestro._id,
      },
      {
        name: "Chicken Burger",
        price: 150,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
        category: burgers._id,
        restaurant: burgerRestro._id,
      },
      {
        name: "Margherita Pizza",
        price: 220,
        image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143",
        category: pizza._id,
        restaurant: pizzaRestro._id,
      },
      {
        name: "Pepperoni Pizza",
        price: 280,
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e",
        category: pizza._id,
        restaurant: pizzaRestro._id,
      },
      {
        name: "Coke",
        price: 50,
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97",
        category: drinks._id,
        restaurant: burgerRestro._id,
      },
      {
        name: "Ice Cream",
        price: 80,
        image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f",
        category: desserts._id,
        restaurant: dessertRestro._id,
      },
    ]);

    console.log("✅ Restaurants & Menu seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seed();
