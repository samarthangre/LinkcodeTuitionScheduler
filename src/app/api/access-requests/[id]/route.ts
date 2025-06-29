import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import AccessRequest from '@/models/AccessRequest'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await dbConnect()

  const { id } = params
  const { status } = await req.json()

  if (!status) {
    return NextResponse.json({ error: 'Missing status' }, { status: 400 })
  }

  const updated = await AccessRequest.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  )

  if (!updated) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true, request: updated })
}
