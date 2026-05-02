const mongoose = require("mongoose");

const userPreferenceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true
    },
    categories: {
      type: Map,
      of: Number,
      default: {}
    },
    brands: {
      type: Map,
      of: Number,
      default: {}
    },
    priceRange: {
      min: Number,
      max: Number
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserPreference", userPreferenceSchema);