import mongoose from 'mongoose'

const AccessRequestSchema = new mongoose.Schema({
  student: { type: String, required: true }, // email
  schedule: { type: String, required: true }, // generated schedule summary
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
})

export default mongoose.models.AccessRequest ||
  mongoose.model('AccessRequest', AccessRequestSchema)
