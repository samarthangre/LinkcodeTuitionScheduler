import mongoose from 'mongoose'

const ScheduleRequestSchema = new mongoose.Schema({
  student: { type: String, required: true },
  tutor: { type: String, required: true },
  messages: [{ type: String }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true })

export default mongoose.models.ScheduleRequest || mongoose.model('ScheduleRequest', ScheduleRequestSchema)
