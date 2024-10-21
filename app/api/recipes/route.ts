import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Recipe from '@/models/Recipe'

export async function GET() {
  await dbConnect()
  const recipes = await Recipe.find({})
  return NextResponse.json(recipes)
}

export async function POST(request: Request) {
  await dbConnect()
  const data = await request.json()
  const recipe = await Recipe.create(data)
  return NextResponse.json(recipe)
}