import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Recipe from '@/models/Recipe'
import VideoEvent from '@/models/VideoEvent'
import InventoryItem from '@/models/InventoryItem'
import Transaction from '@/models/Transaction'
import VideoTemplate from '@/models/VideoTemplate'
import EducationalResource from '@/models/EducationalResource'

export async function GET() {
  try {
    await dbConnect();

    const [recipes, videoEvents, inventory, transactions, videoTemplates, educationalResources] = await Promise.all([
      Recipe.find({}),
      VideoEvent.find({}),
      InventoryItem.find({}),
      Transaction.find({}),
      VideoTemplate.find({}),
      EducationalResource.find({}),
    ])

    return NextResponse.json({
      recipes,
      videoEvents,
      inventory,
      transactions,
      videoTemplates,
      educationalResources,
    })
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}