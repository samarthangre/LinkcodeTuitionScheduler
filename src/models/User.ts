import mongoose, { Schema, model, models } from 'mongoose'

const UserSchema = new Schema({
  email: { type: String, required: true },
  role: { type: String, required: true },
})

export default models.User || model('User', UserSchema)
