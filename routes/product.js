import express from 'express'
import Product from '../model/product.js'

const router = express.Router()

// get all
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// get by id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ error: 'Product not found' })
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// add new
router.post('/', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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

    console.log('Product updated:', updated.name)
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// del
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'Product not found' })
    console.log('Product removed:', deleted.name)
    res.json({ message: 'Product deleted successfully', product: deleted })
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

export default router