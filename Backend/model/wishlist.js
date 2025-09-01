const mongoose = require("mongoose")
const {Schema} = mongoose
const wishlistSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            addedAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
},
);

module.exports = mongoose.model("Wishlist", wishlistSchema)