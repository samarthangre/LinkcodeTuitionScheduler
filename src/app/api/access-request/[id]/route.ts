import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import AccessRequest from '@/models/AccessRequest'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect()
  const { status } = await req.json()

  const updated = await AccessRequest.findByIdAndUpdate(params.id, { status }, { new: true })
  return NextResponse.json(updated)
}
