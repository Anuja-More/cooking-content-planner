import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import InventoryItem from '@/models/InventoryItem'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect()
  const { id } = params
  const data = await request.json()
  const updatedItem = await InventoryItem.findByIdAndUpdate(id, data, { new: true })
  return NextResponse.json(updatedItem)
}