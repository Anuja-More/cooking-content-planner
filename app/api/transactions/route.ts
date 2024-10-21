import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Transaction from '@/models/Transaction'

export async function GET() {
  await dbConnect()
  const transactions = await Transaction.find({})
  return NextResponse.json(transactions)
}

export async function POST(request: Request) {
  await dbConnect()
  const data = await request.json()
  const transaction = await Transaction.create(data)
  return NextResponse.json(transaction)
}