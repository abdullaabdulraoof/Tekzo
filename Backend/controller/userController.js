const User = require("../model/user")
const Product = require("../model/product")
const Cart = require("../model/cart")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const mongoose = require("mongoose");


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

exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id
        console.log(userId);

        const user = await User.findById(userId)
        if (!user) {
            return res.status(401).json({ err: "user is not found" })
        }
        let cartItems = await Cart.aggregate([
            {
                // get the cart from the given user  
                $match: { user: new mongoose.Types.ObjectId(userId) }
            }, {
                // Deconstructs the array "items" into individual docs
                $unwind: "$items"
            }, {
                // join cart items with product Details
                $lookup: {
                    from: "products", //Product collection
                    localField: "items.product", // get product id inside cart.items
                    foreignField: "_id", //id of product collection
                    as: "productDetails"
                }
            }, {
                // productDetails is an array convert to object/doc
                $unwind: "$productDetails"
            }, {
                // Add fields quantity and total amount of (that cart product or per product) to producDetails
                $addFields: {
                    "productDetails.quantity": "$items.quantity",
                    "productDetails.totalPrice": {
                        $multiply: ["$items.quantity", "$productDetails.offerPrice"]
                    }
                }

            }, {
                // group by user collect all items , totalprice
                $group: {
                    _id: "$user",
                    cartItems: { $push: "$productDetails" },
                    totalCartPrice: { $sum: "$productDetails.totalPrice" }
                }
            }, {
                // id is already their, Only return cartItems + totalCartPrice
                $project: {
                    _id: 0,
                    cartItems: 1,
                    totalCartPrice: 1
                }
            }
        ])

        console.log({ cartItems });
        res.json(cartItems[0] || { cartItems: [], totalCartPrice: 0 });
    }

    catch (err) {
        res.status(500).json({ err: err.message })
    }
}

exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // remove item
        await Cart.updateOne(
            { user: userId },
            { $pull: { items: { product: id } } }
        );

        // fetch updated cart
        const cart = await Cart.findOne({ user: userId }).populate("items.product");

        const cartItems = cart.items.map(i => ({
            ...i.product._doc,  // product details
            quantity: i.quantity,
            totalPrice: i.quantity * i.product.offerPrice
        }));

        const totalCartPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

        res.json({ cartItems, totalCartPrice });

    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

exports.changeQuantity = async (req, res) => {
    try {
        const { productId, action } = req.body
        const userId = req.user.id

        const cart = await Cart.findOne({ user: userId })
        if (!cart) {
            return res.status(401).json({ err: "cart is not found" })
        }
        const item = cart.items.find(i => i.product.toString() === productId)
        if (!item) {
            return res.status(401).json({ err: "item is not found" })
        }

        if (action === 'increment') {
            item.quantity += 1
        } else if (action === 'decrement') {
            item.quantity = Math.max(item.quantity - 1, 1)
        }
        await cart.save()

        // populate product to send full details
        const updatedCart = await Cart.findOne({ user: userId }).populate("items.product");
        const cartItems = updatedCart.items.map(i => ({
            ...i.product._doc,
            quantity: i.quantity,
            totalPrice: i.quantity * i.product.offerPrice
        }));
        const totalCartPrice = cartItems.reduce((sum, i) => sum + i.totalPrice, 0);

        res.json({ cartItems, totalCartPrice });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }

}