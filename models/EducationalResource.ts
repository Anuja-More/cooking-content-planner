import mongoose from 'mongoose'

const EducationalResourceSchema = new mongoose.Schema({
  title: String,
  description: String,
  link: String,
  category: {
    type: String,
    enum: ['cooking', 'filming', 'editing'],
  },
})

export default mongoose.models.EducationalResource || mongoose.model('EducationalResource', EducationalResourceSchema)