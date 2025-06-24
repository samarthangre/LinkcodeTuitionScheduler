import { connectToDatabase } from '@/lib/db'
import Message from '@/models/Message'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

export async function GET(req: Request) {
  await connectToDatabase()
  const session = await getServerSession(authOptions)
  const { searchParams } = new URL(req.url)
  const recipient = searchParams.get('recipient')
  const sender = session?.user?.email

  const messages = await Message.find({
    $or: [
      { sender, recipient },
      { sender: recipient, recipient: sender },
    ],
  }).sort({ createdAt: 1 })

  return Response.json(messages)
}

export async function POST(req: Request) {
  await connectToDatabase()
  const session = await getServerSession(authOptions)
  const sender = session?.user?.email
  const { recipient, content } = await req.json()

  const message = await Message.create({ sender, recipient, content })
  return Response.json(message)
}