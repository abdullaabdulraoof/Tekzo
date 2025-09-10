const mongoose = require('mongoose')
const { Schema } = mongoose;
const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String},
    role: { type: String, enum: ["user", "admin"], default: "user" }, // ✅ Add role
    addresses :[{
        address:String,
        pincode:String,
        country:String,
        is_default: { type: Boolean, default: false }
    }],
    defaultAddress: { type: Schema.Types.ObjectId },
     createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("User", userSchema)