const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config();

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const hash = await bcrypt.hash("Admin@123", 10);

  await User.create({
    name: "Admin",
    email: "admin@foodapp.com",
    password: hash,
    role: "admin",
    language: "en",
  });

  console.log("✅ Admin created");
  process.exit();
})();
