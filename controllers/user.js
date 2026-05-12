import User from '../model/user.js'

// Naya user banao
export const createUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    // Check karo pehle se exist karta hai ya nahi
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const user = new User({ email, password })
    await user.save()

    res.status(201).json({ message: 'User created', user })

  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

// User login kare
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid password' })
    }

    res.status(200).json({ message: 'Login successful', user })

  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}