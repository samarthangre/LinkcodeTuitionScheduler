import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema({
  sender: String,
  recipient: String,
  content: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Message || mongoose.model('Message', MessageSchema)
