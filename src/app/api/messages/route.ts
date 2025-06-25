import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Message from '@/models/Message'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await dbConnect()
  const { searchParams } = new URL(req.url)
  const recipient = searchParams.get('recipient')

  const messages = await Message.find({
    $or: [
      { sender: session.user?.email, recipient },
      { sender: recipient, recipient: session.user?.email }
    ]
  }).sort({ createdAt: 1 })

  return NextResponse.json(messages)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await dbConnect()
  const body = await req.json()
  const { recipient, content, schedule } = body

  const newMsg = await Message.create({
    sender: session.user?.email,
    recipient,
    content,
    schedule: schedule || null
  })

  return NextResponse.json(newMsg)
}
