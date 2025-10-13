const express = require('express')
const connectDB = require('./config/db')
const adminRoute = require('./routes/adminRoute')
const userRoute = require('./routes/userRoute')
const cors = require('cors')
const path = require("path");
require('dotenv').config();
const app = express()

app.use(cors({
    origin: 'https://tekzo-2j88.vercel.app',
    credentials: true,
    exposedHeaders: ['Authorization'],
    allowedHeaders: ['Authorization', 'Content-Type'],
}));


app.use((req, res, next) => {
    // Content Security Policy
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' https://cdn.lordicon.com; require-trusted-types-for 'script';"
    );

    // Cross-Origin-Opener-Policy
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");

    // X-Frame-Options
    res.setHeader("X-Frame-Options", "DENY");

    // Optional: other security headers
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Permissions-Policy", "geolocation=(), microphone=()");

    next();
});


app.use(express.json())
app.use(express.urlencoded({extended:true}))
const port = 3000

connectDB()



// serve the uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use('/api/admin', adminRoute)
app.use('/api',userRoute)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
