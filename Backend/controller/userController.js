const User = require("../model/user")
const Product = require("../model/product")
const Cart = require("../model/cart")
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
            id: user.id,   // or admin.id
            role: user.role  // or admin.role
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

exports.showProducts = async (req, res) => {
    const product = await Product.find({})
    if (!product) {
        res.status(400).json({ err: "invalid credentials" })
    }
    res.json({ product })

}
exports.showProductDetails = async (req, res) => {
    const id = req.params.id
    try {
        const product = await Product.findById(id)
        if (!product) {
            res.status(400).json({ err: "invalid credentials" })
        }
        res.json({ product })
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ err: err.message })
    }
}

exports.addToCart = async (req, res) => {

    try {
        const { productId } = req.body
        const userId = req.user.id

        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ err: "product is not found" })
        }
        const user = await User.findById(userId)
        if (!user) {
            return res.status(401).json({ err: "user is not found" });
        }

        let cart = await Cart.findOne({ user: userId })
        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [{ product: productId, quantity: 1 }]
            })
        } else {
            const existingItem = cart.items.find(item => item.product.toString() === productId)
            if (existingItem) {
                existingItem.quantity += 1
            } else {
                cart.items.push({ product: productId, quantity: 1 })
            }
        }
        await cart.save()

        return res.status(200).json({ message: "Product added to cart", cart })


    } catch (err) {
        console.log(err.message);
        res.status(500).json({ err: err.message })
    }

}