import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import InventoryItem from '@/models/InventoryItem'

export async function GET() {
  await dbConnect()
  const items = await InventoryItem.find({})
  return NextResponse.json(items)
}

export async function POST(request: Request) {
  await dbConnect()
  const data = await request.json()
  const item = await InventoryItem.create(data)
  return NextResponse.json(item)
}