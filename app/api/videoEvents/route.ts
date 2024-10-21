import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import VideoEvent from '@/models/VideoEvent'

export async function GET() {
  await dbConnect()
  const events = await VideoEvent.find({})
  return NextResponse.json(events)
}

export async function POST(request: Request) {
  await dbConnect()
  const data = await request.json()
  const event = await VideoEvent.create(data)
  return NextResponse.json(event)
}