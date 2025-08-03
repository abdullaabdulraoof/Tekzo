const express = require('express')
const connectDB = require('./config/db');
const dotenv = require('dotenv')


dotenv.config()

// Connection URL
connectDB(); 


const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

