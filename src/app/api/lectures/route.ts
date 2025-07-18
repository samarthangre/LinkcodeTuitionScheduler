import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Lecture from '@/models/Lecture'

export async function GET() {
  await dbConnect()
  const lectures = await Lecture.find()
  return NextResponse.json(lectures)
}
