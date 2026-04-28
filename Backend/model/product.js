const  mongoose = require('mongoose')
const { Schema } = mongoose;

const ProductSchema = new Schema({
    name: { type: String, required: true },
    sku: { type: Number, required: true,unique:true},
    desc: { type: String },
    price: { type: Number, required: true },
    offerPrice: { type: Number },
    category: { type: String },
    tag: { type: String },
    stockQty: { type: Number },
    brandName: { type: String },
    images: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);