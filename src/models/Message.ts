import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    sender: String,
    recipient: String,
    content: String,
    timestamp: { type: Date, default: Date.now },
    schedule: {
      date: String,   // e.g., "Monday"
      time: String,   // e.g., "4 PM"
      subject: String // optional: e.g., "Math"
    }
  },
  { timestamps: true }
)

export default mongoose.models.Message || mongoose.model('Message', messageSchema)
