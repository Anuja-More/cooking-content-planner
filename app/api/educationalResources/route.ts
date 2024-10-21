import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import EducationalResource from '@/models/EducationalResource'

export async function GET() {
  await dbConnect()
  const resources = await EducationalResource.find({})
  return NextResponse.json(resources)
}

export async function POST(request: Request) {
  await dbConnect()
  const data = await request.json()
  const resource = await EducationalResource.create(data)
  return NextResponse.json(resource)
}