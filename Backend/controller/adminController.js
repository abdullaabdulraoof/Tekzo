const Product = require('../model/product')
const fs = require('fs')
const path = require('path')
exports.addProduct = async (req, res) => {
    try {
        const { name, sku, desc, price, offerPrice, category, tag, stockQty, brandName } = req.body
        const imagePaths = req.files.map(file => {
            const fileName = Date.now() + "-" + file.originalname
            const filePath = path.join("uploads", fileName)
            fs.writeFileSync(filePath, file.buffer)
            return filePath

        })
        const product = new Product({
            name,
            sku,
            desc,
            price,
            offerPrice,
            category,
            tag,
            stockQty,
            brandName,
            images: imagePaths

        })
        await product.save()
        res.status(201).json({ success: true, product })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }

}
exports.getProduct = async (req, res) => {
    try {
        const products = await Product.find()
        res.status(201).json({ success: true, products })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

exports.deleteProduct = async (req, res) => {

    try {
        const { id } = req.params
        const result = await Product.findByIdAndDelete(id)
        if (!result) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(201).json({ success: true, result })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

exports.displayEditProduct = async (req, res) => {

    try {
        const { id } = req.params
        const product = await Product.findById(id)

        res.status(201).json({ success: true, product })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

exports.editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, sku, desc, price, offerPrice, category, tag, stockQty, brandName } = req.body;

        let imagePaths = [];
        if (req.files && req.files.length > 0) {
            imagePaths = await Promise.all(req.files.map(async file => {
                const fileName = Date.now() + "-" + file.originalname;
                const filePath = path.join("uploads", fileName);
                await fs.promises.writeFile(filePath, file.buffer);
                return filePath;
            }));
        }

        const UpdateData = {
            name,
            sku,
            desc,
            price,
            offerPrice,
            category,
            tag,
            stockQty,
            brandName,
        };

        if (imagePaths.length > 0) {
            UpdateData.images = imagePaths;
        }

        const product = await Product.findByIdAndUpdate(id, UpdateData, { new: true });

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, product });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
