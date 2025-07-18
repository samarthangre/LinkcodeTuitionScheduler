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
  return NextResponse.json({ requests })
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await dbConnect()
  const { id } = params
  const { status } = await req.json()

  if (!['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const updated = await AccessRequest.findByIdAndUpdate(id, { status }, { new: true })
  if (!updated) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true, updated })
}
