const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.auth = (req, res, next) => {
    const authHeader = req.header("Authorization");
    console.log("Authorization header received:", req.header("Authorization"));

    if (!authHeader) {
        return res.status(401).json({ error: "No token found, authorization failed" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "No token found, authorization failed" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

exports.isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ msg: "Access denied: Admins only" });
    }
    next();
};
