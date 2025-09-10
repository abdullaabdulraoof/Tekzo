const express = require('express')
const connectDB = require('./config/db')
const adminRoute = require('./routes/adminRoute')
const userRoute = require('./routes/userRoute')
const cors = require('cors')
const path = require("path");
require("dotenv").config();
const app = express()
const passport = require("./middleware/passport");


app.use(cors({
    origin: 'https://tekzo-2j88.vercel.app',
    credentials: true,
    exposedHeaders: ['Authorization'],
    allowedHeaders: ['Authorization', 'Content-Type'],
}));

app.use(express.json())
app.use(express.urlencoded({extended:true}))
const port = 3000

connectDB()

app.use(passport.initialize());
app.use("/api/auth", require("./routes/auth"));

// serve the uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use('/api/admin', adminRoute)
app.use('/api',userRoute)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
