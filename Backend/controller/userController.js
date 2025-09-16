const User = require("../model/user")
const Product = require("../model/product")
const Cart = require("../model/cart")
const Wishlist = require("../model/wishlist")
const Order = require("../model/order")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const mongoose = require("mongoose");
const Razorpay = require('razorpay');
const crypto = require("crypto")
const { oauth2client } = require("../util/googleConfig")
const axios = require('axios')



var instance = new Razorpay({
    key_id: 'rzp_test_luVXkmBGF0GjXs',
    key_secret: '33khU25tAcAPhkNZBmsfHPZu',
});

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
                    _id: 1,
                    cartItems: 1,
                    totalCartPrice: 1
                }
            }
        ])

     
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

exports.getCheckout = async (req, res) => {
    try {
        const userId = req.user.id

        const cart = await Cart.findOne({ user: userId }).populate("items.product");

        if (!cart) {
            return res.status(401).json({ err: "cart is not found" })
        }
        const cartItems = cart.items.map(i => ({
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

exports.placeOrder = async (req, res) => {
    try {
        const { phone, email, paymentMethod, totalAmount, shippingAddress, products } = req.body
        const userid = req.user.id
        // Validate required fields
        if (!phone || !email || !shippingAddress || !paymentMethod || !products || products.length === 0 || !totalAmount) {
            return res.status(400).json({ err: "All fields are required including totalAmount" });
        }


        const newOrder = new Order({
            user: userid,
            products: products.map(p => ({
                product: p.product,
                quantity: p.quantity
            })),
            phone,
            email,
            shippingAddress,
            paymentMethod,
            totalAmount,
            status: paymentMethod === "COD" ? "pending" : "placed", // default status
            createdAt: new Date()
        })
        await newOrder.save();

        // Save default address if user has no addresses yet
        const user = await User.findById(userid);
        if (!user.addresses || user.addresses.length === 0) {
            user.addresses.push({ ...shippingAddress, is_default: true });
            user.defaultAddress = user.addresses[user.addresses.length - 1]._id;
            await user.save();
        }


        // Optionally, clear user's cart after order
        if (paymentMethod === "COD") {
            // Clear cart only for COD
            await Cart.findOneAndUpdate({ user: userid }, { items: [] });
            res.status(201).json(newOrder);
        } else {

            const options = {
                amount: Math.round(totalAmount * 100),  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                currency: "INR",
                receipt: `order: ${newOrder._id}`
            };
            instance.orders.create(options, function (err, order) {
               
                res.status(201).json({ order: order, key: instance.key_id, orderId: newOrder._id });
            });
        }


    } catch (err) {
        res.status(500).json({ err: err.message });

    }

}

exports.paymentVerification = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body
    console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature)
    const userId = req.user.id;
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto.createHmac("sha256", instance.key_secret).update(body.toString()).digest("hex")
 
    const isAuthentic = expectedSignature === razorpay_signature
    if (isAuthentic) {
        await Order.findByIdAndUpdate(orderId, {
            status: "paid",
            razorpay_order_id,
            razorpay_payment_id
        });

        // ✅ Clear cart after successful payment
        await Cart.findOneAndUpdate({ user: userId }, { items: [] });

        return res.json({ success: true, message: "Payment verified", orderId });
    } else {
        return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

}

exports.getproductcard = async (req, res) => {
    try {

        const product = await Product.find()
        if (!product) {
            return res.status(400).json({ err: "Product not found" });
        }
        res.json(product)

    } catch (err) {
        return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

}

exports.getorderList = async (req, res) => {
    try {
        const userId = req.user.id

        const orders = await Order.find({ user: userId })
            .populate("products.product", "name price images");
        // 👆 this tells mongoose: replace product ObjectId with { name, price, image }

        if (!orders || orders.length === 0) {
            return res.status(400).json({ err: "Orders not found" });
        }
        res.status(200).json({ success: true, orders });
    } catch (err) {
        res.status(400).json({ success: false, message: "Order is not found", error: err.message });
    }
};

exports.addwishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { prodtId } = req.body;

        // check product exists
        const product = await Product.findById(prodtId);
        if (!product) {
            return res.status(400).json({ err: "Product not found" });
        }

        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            wishlist = new Wishlist({ user: userId, products: [] });
        }

        // check if product already exists in wishlist
        const index = wishlist.products.findIndex(
            (p) => p.product.toString() === prodtId
        );

        if (index > -1) {
            // already exists → remove (toggle)
            wishlist.products.splice(index, 1);
        } else {
            // add
            wishlist.products.push({ product: prodtId });
        }

        await wishlist.save();

        res.json({ wishlist });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const wishlist = await Wishlist.findOne({ user: userId })
            .populate("products.product", "name price offerPrice images brandName");

        if (!wishlist) {
            return res.status(400).json({ err: "wishlist not found" });
        }

        res.json({ wishlist });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ err: "user not found" });
        }

        // pick address marked as default
        const defaultAddress = user.addresses.find((addr) => addr.is_default === true);

        res.json({
            username: user.username,
            email: user.email,
            addresses: user.addresses,
            defaultAddress: defaultAddress || null,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// In your userController.js or cartController.js

exports.getCartCount = async (req, res) => {
    try {
        const userId = req.user.id; 
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.json({ count: 0 });
        }
        const count = cart.items.reduce((acc, item) => acc + item.quantity, 0);

        res.json({ count });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};


exports.updateUser = async (req, res) => {
    try {
        const userId = req.user.id
        const { username, email } = req.body
        const user = await User.findByIdAndUpdate(
            userId,
            { username, email },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(400).json({ err: "user not found" });
        }

        res.json({ message: "User Updated Successfully", user });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
}

exports.updateAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { address, pincode, country } = req.body;

        if (!address || !pincode || !country) {
            return res.status(400).json({ err: "All fields are required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ err: "User not found" });
        }

        // New address object
        const newAddress = {
            _id: new mongoose.Types.ObjectId(),
            address,
            pincode,
            country,
            is_default: true,
        };

        // Reset all old addresses to non-default
        user.addresses.forEach((addr) => (addr.is_default = false));

        // Push new address
        user.addresses.push(newAddress);

        // Set default reference
        user.defaultAddress = newAddress._id;

        await user.save();

        res.json({
            message: "Address updated successfully",
            defaultAddress: newAddress,
            allAddresses: user.addresses, // send full list if frontend needs it
        });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};


exports.googleLogin = async (req, res) => {
    try {
        const { code } = req.query
       
        const googleRes = await oauth2client.getToken(code)
        
        oauth2client.setCredentials(googleRes.tokens)
        const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`)

        

        const {email,name} = userRes.data
        

        let user = await User.findOne({email})
        if(!user){
            user = new User({
                username:name, 
                email:email,
                password:null,
                authProvider: "google",
            })
            await user.save()
            

        } else {
            // Already exists → just update authProvider
            user.authProvider = "google";
            await user.save();
        }
        const {_id}=user
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "12h" }
        );
        return res.status(200).json({
            message:"success",
            token,
            user
        })
    } catch (err) {
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
}