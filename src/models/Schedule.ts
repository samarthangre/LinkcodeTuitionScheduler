// ✅ /src/models/Schedule.ts
import mongoose, { Schema, models } from 'mongoose'

const ScheduleSchema = new Schema(
  {
    student: { type: String, required: true },
    studentEmail: { type: String, required: true },
    tutor: { type: String },
    details: { type: String }, // Store schedule string or JSON if needed
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
  },
  { timestamps: true }
)

const Schedule = models.Schedule || mongoose.model('Schedule', ScheduleSchema)

export default Schedule
