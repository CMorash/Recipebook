import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { getJWTSecret } from '../config/secrets'

export interface AuthRequest extends Request {
  userId?: string
}

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    const jwtSecret = await getJWTSecret()

    const decoded = jwt.verify(token, jwtSecret) as { userId: string }
    req.userId = decoded.userId

    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

