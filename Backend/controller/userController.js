const User = require("../model/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")


exports.userSignup = async (req, res) => {
    const { username, email, password } = req.body
    try {
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ err: "User is already existed" });
        }
        user = new User({
            username,
            email,
            password
        })
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)
        await user.save()
        return res.status(201).json({ message: "user is created" });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ err: err.message })

    }
}

exports.userLogin = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            res.status(400).json({ err: "invalid credentials" })
        }
        const verify = await bcrypt.compare(password, user.password)
        if (!verify) {
            res.status(400).json({ err: "password is incorrect" })
        }
        const payload = {
            user: {
                id: user.id,
            }
        }
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err
            res.json({ token })
        })

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ err: err.message })
    }
}   

exports.userLogout = async (req, res) => {
    res.status(200).json({ message: "Logged out successfully" });
};