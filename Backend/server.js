const express = require('express')
const connectDB = require('./config/db')
const adminRoute = require('./routes/adminRoute')
const userRoute = require('./routes/userRoute')
const aiChatRoute = require('./routes/aiChatRoute')
const aiAnalyticsRoute = require("./routes/aiAnalyticsRoute");
const ai = require('./routes/ai')
const cors = require('cors')
const path = require("path");
require('dotenv').config();

const app = express()
const http = require('http');
const server = http.createServer(app);
const socketUtils = require('./utils/socket');
const io = socketUtils.init(server);

const helmet = require('helmet');
app.use(helmet());

app.use(cors({
    origin: [
        "https://tekzo-2j88.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173"
    ],
    credentials: true,
    exposedHeaders: ['Authorization'],
    allowedHeaders: ['Authorization', 'Content-Type'],
}));

app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' https://cdn.lordicon.com https://apis.google.com;connect-src 'self' https://www.googleapis.com;"
    );
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Permissions-Policy", "geolocation=(), microphone=()");
    next();
});

app.use(express.json())
app.use(express.urlencoded({extended:true}))
const port = 3000

connectDB()

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/ping", (req, res) => {
    res.status(200).json({ message: "Server is awake" });
});

app.use('/api/admin', adminRoute)
app.use('/api', userRoute)
app.use("/ai", ai);
app.use("/api/ai-chat", aiChatRoute);
app.use("/api/ai-analytics", aiAnalyticsRoute);

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
