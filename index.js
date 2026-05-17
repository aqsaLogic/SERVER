import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import Product from './model/product.js'
import { signJWT, verifyJWT } from './Utils/jwt.js'
import User from './model/user.js'
import UserRoute from './routes/user.js'
import ProductRoute from './routes/product.js'

const app = express()
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'https://animated-hotteok-f30e15.netlify.app',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))

app.use(express.json())
app.use('/api/user', UserRoute)
app.use('/api/products', ProductRoute)

app.get("/", (req, res) => {
  res.send("Backend is Running Successfully");
});

async function ConnectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("DB connected")
  } catch (error) {
    console.error("DB connection error:", error)
  }
}
ConnectDB()

app.listen(PORT, () => {
  console.log('Server is running: http://localhost:' + PORT)
})
