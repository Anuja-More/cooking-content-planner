import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import VideoTemplate from '@/models/VideoTemplate'

export async function GET() {
  await dbConnect()
  const templates = await VideoTemplate.find({})
  return NextResponse.json(templates)
}

export async function POST(request: Request) {
  await dbConnect()
  const data = await request.json()
  const template = await VideoTemplate.create(data)
  return NextResponse.json(template)
}