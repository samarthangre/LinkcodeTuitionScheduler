// ✅ /src/app/api/access-requests/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/db'
import AccessRequest from '@/models/AccessRequest'

export async function POST(req: Request) {
  await dbConnect()
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { schedule } = await req.json()

  if (!schedule) {
    return NextResponse.json({ error: 'Missing schedule' }, { status: 400 })
  }

  const request = await AccessRequest.create({
    student: session.user.name || session.user.email,
    studentEmail: session.user.email,
    schedule,
    status: 'pending',
  })

  return NextResponse.json({ success: true, request })
}

export async function GET() {
  await dbConnect()
  const requests = await AccessRequest.find().sort({ createdAt: -1 })
  return NextResponse.json({ requests }) // ✅ Important: return { requests }
}
