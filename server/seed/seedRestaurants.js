const mongoose = require("mongoose");
require("dotenv").config();

const Restaurant = require("../models/Restaurant");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding restaurants");

    // ❌ Clear old data
    await Restaurant.deleteMany();

    // ✅ Insert restaurants
    await Restaurant.insertMany([
      {
        name: "Burger Hub",
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
        rating: 4.4,
        deliveryTime: "25–35 mins",
        distance: 2.3,
        isVeg: false,
        categories: ["Burgers", "Fast Food"],
      },
      {
        name: "Pizza Palace",
        image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143",
        rating: 4.6,
        deliveryTime: "30–40 mins",
        distance: 3.8,
        isVeg: false,
        categories: ["Pizza", "Italian"],
      },
      {
        name: "Green Leaf Cafe",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
        rating: 4.8,
        deliveryTime: "20–30 mins",
        distance: 1.5,
        isVeg: true,
        categories: ["Healthy", "Salads", "Cafe"],
      },
      {
        name: "Spice Route",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe",
        rating: 4.5,
        deliveryTime: "35–45 mins",
        distance: 4.2,
        isVeg: false,
        categories: ["Indian", "North Indian"],
      },
      {
        name: "Sweet Treats",
        image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f",
        rating: 4.7,
        deliveryTime: "15–25 mins",
        distance: 1.2,
        isVeg: true,
        categories: ["Desserts", "Bakery"],
      },
      {
        name: "Cafe Mocha",
        image: "https://images.unsplash.com/photo-1511920170033-f8396924c348",
        rating: 4.3,
        deliveryTime: "20–30 mins",
        distance: 2.8,
        isVeg: true,
        categories: ["Cafe", "Beverages"],
      },
      {
        name: "Tandoori Nights",
        image: "https://images.unsplash.com/photo-1600628422019-41e9f7c7c4b5",
        rating: 4.6,
        deliveryTime: "40–50 mins",
        distance: 5.0,
        isVeg: false,
        categories: ["Indian", "Tandoor"],
      },
      {
        name: "Urban Bowl",
        image: "https://images.unsplash.com/photo-1546069901-eacef0df6022",
        rating: 4.5,
        deliveryTime: "25–35 mins",
        distance: 3.0,
        isVeg: true,
        categories: ["Bowls", "Healthy"],
      },
    ]);

    console.log("✅ Restaurants seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seed();
