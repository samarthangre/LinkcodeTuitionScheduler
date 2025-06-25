'use client'
import { useEffect, useState } from 'react'

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<any[]>([])

  const fetchRequests = async () => {
    const res = await fetch('/api/schedule-requests')
    const data = await res.json()
    setRequests(data)
  }

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/schedule-requests', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    fetchRequests()
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📥 Student Schedule Requests</h2>
      {requests.map((req) => (
        <div key={req._id} className="border p-4 rounded mb-4 bg-white shadow">
          <p><strong>Student:</strong> {req.student}</p>
          <p><strong>Tutor:</strong> {req.tutor}</p>
          <p><strong>Status:</strong> {req.status}</p>
          <div className="my-2 space-y-1 text-sm">
            {req.messages.map((msg: string, i: number) => (
              <p key={i} className="text-gray-600">💬 {msg}</p>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={() => updateStatus(req._id, 'approved')} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
            <button onClick={() => updateStatus(req._id, 'rejected')} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
          </div>
        </div>
      ))}
    </div>
  )
}
