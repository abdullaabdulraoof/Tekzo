const mongoose = require('mongoose')
const { Schema } = mongoose;

const adminSchema = new Schema({
    username: { type: String, required: true ,unique:true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin"], default: "admin" }

})

module.exports = mongoose.model("Admin", adminSchema)