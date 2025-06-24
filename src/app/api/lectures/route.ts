import { connectToDatabase } from '@/lib/db'
import Lecture from '@/models/Lecture'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  await connectToDatabase()
  const lectures = await Lecture.find({})
  return NextResponse.json({ lectures })
}

export async function POST(req: NextRequest) {
  await connectToDatabase()
  const body = await req.json()

  try {
    const newLecture = await Lecture.create(body)
    return NextResponse.json({ lecture: newLecture })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 })
  }
}