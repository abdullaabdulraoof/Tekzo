const express = require('express')
const connectDB = require('./config/db')
const adminRoute = require('./routes/adminRoute')
const cors = require('cors')
require("dotenv").config();
const app = express()

app.use(cors({
    origin: 'http://localhost:5173' 
}));
app.use(express.json())
const port = 3000

connectDB()


app.use('/api/admin', adminRoute)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
