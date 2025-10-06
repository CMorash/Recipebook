import mongoose from 'mongoose'
import { getMongoDBUri } from './secrets'

const connectDB = async () => {
  try {
    const mongoURI = await getMongoDBUri()
    await mongoose.connect(mongoURI)
    console.log('✅ MongoDB connected successfully')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}

export default connectDB

