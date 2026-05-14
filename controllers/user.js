import User from '../model/user.js'
import encryptjs from 'encryptjs'

export const createUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const secretkey = process.env.SECRET_KEY
    const cipherPassword = encryptjs.encrypt(password, secretkey, 256)

    const user = new User({ email, password: cipherPassword })
    await user.save()

    res.status(201).json({ message: 'User created', user })

  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}

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

    const secretkey = process.env.SECRET_KEY
    const decipher = encryptjs.decrypt(user.password, secretkey, 256)

    if (decipher !== password) {
      return res.status(401).json({ error: 'Invalid password' })
    }

    res.status(200).json({ message: 'Login successful', user })

  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
}