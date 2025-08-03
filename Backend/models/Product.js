const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Category: { type: String, required: true },
    Description: { type: String },
    Image: { type: String },
    Price: { type: Number, required: true }
});

module.exports = mongoose.model('Product', productSchema);