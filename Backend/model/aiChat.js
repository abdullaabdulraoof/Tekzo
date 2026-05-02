const mongoose = require("mongoose");

const aiChatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    sessionId: {
      type: String,
      required: true
    },
    sender: {
      type: String,
      enum: ["user", "ai"],
      required: true
    },
    text: {
      type: String,
      required: true
    },
    products: {
      type: Array,
      default: []
    },
    cart: {
      type: Object,
      default: null
    },
    type: {
      type: String,
      default: "chat"
    },
    pendingAction: {
      type: Object,
      default: null
    },
    isEdited: {
      type: Boolean,
      default: false
    },
    checkout: {
      type: Object,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AiChat", aiChatSchema);