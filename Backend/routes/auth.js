const express = require("express");
const passport = require("passport");
const router = express.Router();

// Start Google login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback after Google login
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        const { token } = req.user;
        // redirect back to React app with token in query string
        res.redirect(`${process.env.CLIENT_URL}/google-success?token=${token}`);
    }
);

module.exports = router;
