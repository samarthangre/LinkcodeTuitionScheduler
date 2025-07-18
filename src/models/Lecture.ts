import mongoose, { Schema, model, models } from 'mongoose'

const LectureSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
})

export default models.Lecture || model('Lecture', LectureSchema)
