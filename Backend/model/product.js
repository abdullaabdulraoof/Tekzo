
const  mongoose = require('mongoose')
const { Schema } = mongoose;

const ProductSchema = new Schema({
    name: { type: String, required: true },
    sku: { type: Number, required: true, unique: true },
    desc: { type: String },
    price: { type: Number, required: true },
    offerPrice: { type: Number },
    category: { type: String },
    tag: { type: String },
    stockQty: { type: Number },
    brandName: { type: String },
    images: [{ type: String }]

});

module.exports = mongoose.model("Product", ProductSchema);