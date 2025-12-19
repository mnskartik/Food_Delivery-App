const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    console.log("SIGNUP BODY:", req.body); // 🔴 ADD THIS

    const { name, email, password, language } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hash,
      language: language || "en",
      role: "user",
    });

    res.status(201).json({ msg: "Signup successful" });
  } catch (err) {
    console.error("🔥 SIGNUP ERROR:", err); // 🔴 ADD THIS
    res.status(500).json({ msg: err.message || "Signup failed" });
  }
};




exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ msg: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (err) {
  console.error("LOGIN ERROR:", err);
  res.status(500).json({ msg: err.message || "Login failed" });
}

};
