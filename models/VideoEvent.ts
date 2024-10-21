import mongoose from 'mongoose'

const VideoEventSchema = new mongoose.Schema({
  title: String,
  date: Date,
  type: {
    type: String,
    enum: ['filming', 'editing', 'publishing'],
  },
})

export default mongoose.models.VideoEvent || mongoose.model('VideoEvent', VideoEventSchema)