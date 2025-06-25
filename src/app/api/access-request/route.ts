// ✅ src/app/api/access-request/route.ts
import dbConnect from '@/lib/db'
import mongoose from 'mongoose'
import { NextResponse } from 'next/server'

// Schema (if not registered yet)
const AccessRequestSchema = new mongoose.Schema(
  {
    email: String,
    reason: String,
    schedule: String,
    approved: Boolean,
  },
  { timestamps: true }
)

const AccessRequest =
  mongoose.models.AccessRequest ||
  mongoose.model('AccessRequest', AccessRequestSchema)

// GET: Fetch all access requests
export async function GET() {
  await dbConnect()
  const requests = await AccessRequest.find().sort({ createdAt: -1 })
  return NextResponse.json(requests)
}

// POST: Approve or reject a request
export async function POST(req: Request) {
  await dbConnect()
  const { id, approved } = await req.json()

  if (!id || approved === undefined) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const updated = await AccessRequest.findByIdAndUpdate(
    id,
    { approved },
    { new: true }
  )

  return NextResponse.json(updated)
}
