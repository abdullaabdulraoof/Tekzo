const Product = require('../model/product')
const fs = require('fs')
const path = require('path')
exports.addProduct = async (req, res) => {
    try {
        const { name, sku, desc, price, offerPrice, category, tag, stockQty, brandName } = req.body
        const imagePaths = req.files.map(file => {
            const fileName = Date.now()+"-"+file.originalname
            const filePath = path.join("uploads", fileName)
            fs.writeFileSync(filePath,file.buffer)
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
    } catch(err){
        res.status(500).json({ success: false, message: err.message })
    }

}