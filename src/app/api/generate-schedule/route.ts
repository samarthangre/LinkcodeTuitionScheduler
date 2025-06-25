// ✅ src/app/api/generate-schedule/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Message from '@/models/Message'

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  await dbConnect()

  const messages = await Message.find({
    $or: [{ sender: email }, { recipient: email }],
  }).sort({ createdAt: 1 })

  // Basic pattern matching for schedule terms
  const schedule = messages
    .map((msg: any) => msg.content.toLowerCase())
    .filter(
      (text) =>
        text.includes('every') ||
        text.includes('pm') ||
        text.includes('am') ||
        text.includes('class') ||
        text.includes('schedule') ||
        text.includes('week') ||
        text.includes('day')
    )

  return NextResponse.json({ schedule })
}
