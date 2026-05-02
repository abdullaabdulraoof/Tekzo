const mongoose = require("mongoose");

const aiInteractionLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    query: {
      type: String,
      required: true
    },
    action: {
      type: String,
      default: "UNKNOWN"
    },
    toolUsed: {
      type: String,
      default: "unknown"
    },
    responseType: {
      type: String,
      default: "chat"
    },
    success: {
      type: Boolean,
      default: false
    },
    productsShown: {
      type: Array,
      default: []
    },
    cartTotal: {
      type: Number,
      default: 0
    },
    message: {
      type: String,
      default: ""
    },
    upsellProductsShown: {
      type: Array,
      default: []
    },
    bundleShown: {
      type: Object,
      default: null
    },
    eventType: {
      type: String,
      default: "ai_response"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AiInteractionLog", aiInteractionLogSchema);