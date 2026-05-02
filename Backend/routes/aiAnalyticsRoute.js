const express = require("express");
const router = express.Router();

const AiInteractionLog = require("../model/aiIteractionLog");
const UserPreference = require("../model/userPreference");
const { auth, isAdmin } = require("../middleware/auth");

// Save AI log + update user preferences
router.post("/log", auth, async (req, res) => {
  try {
    const {
      query,
      action,
      toolUsed,
      responseType,
      success,
      productsShown = [],
      upsellProductsShown = [],
      bundleShown = null,
      cartTotal = 0,
      message = "",
      eventType = "ai_response"
    } = req.body;

    const log = await AiInteractionLog.create({
      user: req.user.id,
      query,
      action: action || "UNKNOWN",
      toolUsed: toolUsed || "unknown",
      responseType: responseType || "chat",
      success: Boolean(success),
      productsShown,
      upsellProductsShown,
      bundleShown,
      cartTotal,
      message,
      eventType
    });

    let pref = await UserPreference.findOne({ user: req.user.id });

    if (!pref) {
      pref = new UserPreference({
        user: req.user.id,
        categories: {},
        brands: {},
        priceRange: {}
      });
    }

    [...productsShown, ...upsellProductsShown].forEach((p) => {
      const category = p.category || "Unknown";
      const brand = p.brand || p.brandName || "Unknown";

      pref.categories.set(category, (pref.categories.get(category) || 0) + 1);
      pref.brands.set(brand, (pref.brands.get(brand) || 0) + 1);
    });

    if (cartTotal > 0) {
      pref.priceRange = {
        min: pref.priceRange?.min
          ? Math.min(pref.priceRange.min, cartTotal)
          : cartTotal,
        max: pref.priceRange?.max
          ? Math.max(pref.priceRange.max, cartTotal)
          : cartTotal
      };
    }

    pref.lastUpdated = new Date();
    await pref.save();

    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Log frontend upsell / bundle event
router.post("/event", auth, async (req, res) => {
  try {
    const {
      eventType,
      product,
      bundle,
      query = "",
      message = ""
    } = req.body;

    const log = await AiInteractionLog.create({
      user: req.user.id,
      query,
      action: eventType,
      toolUsed: "frontend_event",
      responseType: "event",
      success: true,
      productsShown: product ? [product] : [],
      upsellProductsShown: product ? [product] : [],
      bundleShown: bundle || null,
      message,
      eventType
    });

    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Admin summary
router.get("/summary", auth, isAdmin, async (req, res) => {
  try {
    const totalInteractions = await AiInteractionLog.countDocuments();

    const failedQueries = await AiInteractionLog.countDocuments({
      success: false
    });

    const actionStats = await AiInteractionLog.aggregate([
      { $group: { _id: "$action", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const topQueries = await AiInteractionLog.aggregate([
      { $group: { _id: "$query", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const topTools = await AiInteractionLog.aggregate([
      { $group: { _id: "$toolUsed", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const topUpsellProducts = await AiInteractionLog.aggregate([
      { $unwind: "$upsellProductsShown" },
      {
        $group: {
          _id: "$upsellProductsShown.name",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const eventStats = await AiInteractionLog.aggregate([
      { $group: { _id: "$eventType", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const bundleShownCount = await AiInteractionLog.countDocuments({
      bundleShown: { $ne: null }
    });

    res.json({
      totalInteractions,
      failedQueries,
      actionStats,
      topQueries,
      topTools,
      topUpsellProducts,
      eventStats,
      bundleShownCount
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Upsell analytics only
router.get("/upsell-summary", auth, isAdmin, async (req, res) => {
  try {
    const addOnShown = await AiInteractionLog.countDocuments({
      eventType: "upsell_shown"
    });

    const addOnClicked = await AiInteractionLog.countDocuments({
      eventType: "upsell_clicked"
    });

    const addOnAdded = await AiInteractionLog.countDocuments({
      eventType: "upsell_added_to_cart"
    });

    const bundleShown = await AiInteractionLog.countDocuments({
      eventType: "bundle_shown"
    });

    const bundleClicked = await AiInteractionLog.countDocuments({
      eventType: "bundle_clicked"
    });

    const bundleAdded = await AiInteractionLog.countDocuments({
      eventType: "bundle_added_to_cart"
    });

    const topUpsellProducts = await AiInteractionLog.aggregate([
      { $unwind: "$upsellProductsShown" },
      {
        $group: {
          _id: "$upsellProductsShown.name",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      addOnShown,
      addOnClicked,
      addOnAdded,
      bundleShown,
      bundleClicked,
      bundleAdded,
      topUpsellProducts
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Recent logs
router.get("/logs", auth, isAdmin, async (req, res) => {
  try {
    const logs = await AiInteractionLog.find()
      .populate("user", "username email")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(logs);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Get current user's AI preferences
router.get("/preferences/me", auth, async (req, res) => {
  try {
    const pref = await UserPreference.findOne({ user: req.user.id });

    if (!pref) {
      return res.json({
        categories: {},
        brands: {},
        priceRange: {}
      });
    }

    res.json(pref);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;