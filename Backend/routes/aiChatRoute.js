const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const AiChat = require("../model/aiChat");
const { auth } = require("../middleware/auth");

// Save chat message
router.post("/save", auth, async (req, res) => {
  try {
    const {
      sessionId,
      sender,
      text,
      products,
      cart,
      type,
      pendingAction,
      isEdited,
      checkout
    } = req.body;

    const chat = await AiChat.create({
      user: req.user.id,
      sessionId,
      sender,
      text,
      products: products || [],
      cart: cart || null,
      type: type || "chat",
      pendingAction: pendingAction || null,
      isEdited: isEdited || false,
      checkout: checkout || null
    });

    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Get messages of one session
router.get("/:sessionId", auth, async (req, res) => {
  try {
    const chats = await AiChat.find({
      user: req.user.id,
      sessionId: req.params.sessionId
    }).sort({ createdAt: 1 });

    res.json(chats);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Get all sessions
router.get("/", auth, async (req, res) => {
  try {
    const sessions = await AiChat.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id)
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $group: {
          _id: "$sessionId",
          lastMessage: { $first: "$text" },
          updatedAt: { $first: "$createdAt" }
        }
      },
      {
        $sort: {
          updatedAt: -1
        }
      }
    ]);

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Delete one session
router.delete("/:sessionId", auth, async (req, res) => {
  try {
    await AiChat.deleteMany({
      user: req.user.id,
      sessionId: req.params.sessionId
    });

    res.json({ message: "Chat session deleted" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;