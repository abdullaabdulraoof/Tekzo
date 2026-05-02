const mongoose = require("mongoose")
const { Schema } = mongoose

const OrderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, default: 1 }

        }
    ],
    phone: { type: String, required: true },
    email: { type: String, required: true },
    shippingAddress: {
        address: { type: String, required: true },
        pincode: { type: String, required: true },
        country: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'Online'],
        required: true
    }, totalAmount: {
        type: Number,
        required: true
    }, status: {
        type: String,
        enum: ['placed', 'pending', 'shipped', 'delivered', 'cancelled', 'returned'],
        default: 'pending'
    },
    trackingHistory: [
        {
            status: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
            message: { type: String }
        }
    ],
    request: {
        requestType: { type: String, enum: ['none', 'cancel', 'return'], default: 'none' },
        status: { type: String, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none' },
        reason: { type: String },
        images: [{ type: String }],
        requestedAt: { type: Date }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Order", OrderSchema);