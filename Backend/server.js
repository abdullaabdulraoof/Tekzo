const express = require('express')
const connectDB = require('./config/db')
const adminRoute = require('./routes/adminRoute')
const userRoute = require('./routes/userRoute')
const cors = require('cors')
const path = require("path");
require("dotenv").config();
const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    exposedHeaders: ['Authorization'],
    allowedHeaders: ['Authorization', 'Content-Type'],
}));

app.use(express.json())
const port = 3000

connectDB()


// serve the uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use('/api/admin', adminRoute)
app.use('/api',userRoute)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
