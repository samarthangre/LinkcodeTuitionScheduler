import { connectToDatabase } from '@/lib/db'
import Message from '@/models/Message'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json([], { status: 401 })

  const email = session.user?.email
  const { searchParams } = new URL(req.url)
  const recipient = searchParams.get('recipient')

  await connectToDatabase()
  const messages = await Message.find({
    $or: [
      { sender: email, recipient },
      { sender: recipient, recipient: email }
    ]
  }).sort({ createdAt: 1 })

  return NextResponse.json(messages)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sender = session.user?.email
  const { recipient, content } = await req.json()

  await connectToDatabase()
  const newMessage = await Message.create({ sender, recipient, content })
  return NextResponse.json(newMessage)
}
