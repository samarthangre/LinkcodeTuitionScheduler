import mongoose from 'mongoose'

const LectureSchema = new mongoose.Schema({
  title: String,
  tutor: String,
  date: String,
  time: String,
  student: String,
})

export default mongoose.models.Lecture || mongoose.model('Lecture', LectureSchema)
