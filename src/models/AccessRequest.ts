import mongoose, { Schema, models, model } from 'mongoose'

const accessRequestSchema = new Schema(
  {
    student: { type: String, required: true },
    schedule: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
)

const AccessRequest = models.AccessRequest || model('AccessRequest', accessRequestSchema)
export default AccessRequest
