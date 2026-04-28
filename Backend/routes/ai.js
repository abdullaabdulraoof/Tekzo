const express = require("express");
const router = express.Router();
const axios = require("axios");
const Product = require("../model/product");

// Product export for Python ingestion
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    console.error("Product fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// AI chat route -> forwards request to Python FastAPI service
router.post("/chat", async (req, res) => {
  try {
    const { message, token } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await axios.post("http://127.0.0.1:8001/chat", {
      message,
      token: token || null,
    });

    res.json(response.data);
  } catch (err) {
    console.error("AI chat error:", err.message);

    if (err.response) {
      return res.status(err.response.status).json({
        error: err.response.data || "Python AI service error",
      });
    }

    res.status(500).json({ error: "Failed to connect to AI service" });
  }
});

module.exports = router;