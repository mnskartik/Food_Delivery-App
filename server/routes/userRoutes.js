const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// Get logged-in user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch user" });
  }
});



router.put("/language", auth, async (req, res) => {
  const { language } = req.body;

  if (!["en", "zu"].includes(language)) {
    return res.status(400).json({ msg: "Invalid language" });
  }

  await User.findByIdAndUpdate(req.user.id, { language });
  res.json({ msg: "Language updated", language });
});


module.exports = router;
