import mongoose from 'mongoose'

const InventoryItemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  expirationDate: Date,
})

export default mongoose.models.InventoryItem || mongoose.model('InventoryItem', InventoryItemSchema)