import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import ScheduleRequest from '@/models/ScheduleRequest'

export async function GET() {
  await dbConnect()
  const requests = await ScheduleRequest.find().sort({ createdAt: -1 })
  return NextResponse.json(requests)
}

export async function POST(req: NextRequest) {
  await dbConnect()
  const data = await req.json()
  const request = await ScheduleRequest.create(data)
  return NextResponse.json(request)
}

export async function PUT(req: NextRequest) {
  await dbConnect()
  const { id, status } = await req.json()
  const updated = await ScheduleRequest.findByIdAndUpdate(id, { status }, { new: true })
  return NextResponse.json(updated)
}
