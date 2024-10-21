import mongoose from 'mongoose'

const VideoTemplateSchema = new mongoose.Schema({
  name: String,
  description: String,
  sections: [String],
})

export default mongoose.models.VideoTemplate || mongoose.model('VideoTemplate', VideoTemplateSchema)