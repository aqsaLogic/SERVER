import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import Product from './model/product.js'
import { signJWT, verifyJWT } from './Utils/jwt.js'
import User from './model/user.js'
import UserRoute from './routes/user.js'

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

app.use('/api/user', UserRoute)

const jwtToken = signJWT({
  userId: "12134",
  userType: "admin",
});
console.log(jwtToken);


async function ConnectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("DB connected")
  } catch (error) {
    console.error("DB connection error:", error)
  }
}
ConnectDB()

// get all
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// get by id
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// add new
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, description, imageUrl, category } = req.body

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price and category are required' })
    }

    const newProduct = new Product({
      name,
      price: Number(price),
      description: description || '',
      imageUrl: imageUrl || '',
      category,
    })

    const saved = await newProduct.save()
    console.log('POST - product added:', saved.name)
    res.status(201).json(saved)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// put
app.put('/api/products/:id', async (req, res) => {
  try {
    const { name, price, description, imageUrl, category } = req.body

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price: Number(price),
        description: description || '',
        imageUrl: imageUrl || '',
        category,
      },
      { new: true }
    )

    if (!updated) return res.status(404).json({ error: 'Product not found' })

    console.log('PUT - product updated:', updated.name)
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// del
app.delete('/api/products/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'Product not found' })
    console.log('DELETE - product removed:', deleted.name)
    res.json({ message: 'Product deleted successfully', product: deleted })
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

app.listen(PORT, () => {
  console.log('Server is running: http://localhost:' + PORT)
})
