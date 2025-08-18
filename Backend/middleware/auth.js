const jwt = require("jsonwebtoken")
const dotenv = require('dotenv')

module.exports = function (req, res, next) {
    const authHeader = req.header('Authorization'); 
    if (!authHeader) {
        return res.status(401).json({ error: "No token found authorization failed" })
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json({ error: "No token found authorization failed" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded.user
        next()
    } catch (error) {
        res.status(401).json({ meassage: "invalid token" })
    }

}