import mongoose from 'mongoose'

const TransactionSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  type: {
    type: String,
    enum: ['income', 'expense'],
  },
  date: Date,
})

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema)