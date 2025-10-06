import { Request, Response } from 'express'
import jwt, { SignOptions } from 'jsonwebtoken'
import User from '../models/User.model'
import { AuthRequest } from '../middleware/auth.middleware'
import { getJWTSecret } from '../config/secrets'

// Generate JWT token
const generateToken = async (userId: string): Promise<string> => {
  const jwtSecret = await getJWTSecret()
  
  const options: SignOptions = {
    expiresIn: Number(process.env.JWT_EXPIRES_IN) || 7 * 24 * 60 * 60, // 7 days in seconds
  }

  return jwt.sign({ userId }, jwtSecret, options)
}

// Register new user
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' })
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email already exists' })
      }
      return res.status(400).json({ message: 'Username already exists' })
    }

    // Create new user
    const user = new User({
      username,
      email,
      passwordHash: password, // Will be hashed by pre-save middleware
    })

    await user.save()

    // Generate token
    const token = await generateToken(user._id!.toString())

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ message: 'Error registering user' })
  }
}

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // Find user by email
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Generate token
    const token = await generateToken(user._id!.toString())

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Error logging in' })
  }
}

// Get current user
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    console.error('Get current user error:', error)
    res.status(500).json({ message: 'Error fetching user' })
  }
}

