const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  price: Number,

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },

  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
});

module.exports = mongoose.model("MenuItem", menuItemSchema);
