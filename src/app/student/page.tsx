'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BadgeCheck, Loader2 } from 'lucide-react'

interface Request {
  _id: string
  schedule: string
  status: 'pending' | 'approved' | 'rejected'
}

export default function StudentDashboard() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await axios.get('/api/access-requests')
        setRequests(res.data.requests.filter((r: Request) => r.status === 'approved'))
      } catch (error) {
        console.error('Failed to fetch schedules:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSchedules()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>

      <Link href="/student/chat">
        <Button className="mb-4">💬 Go to Chat</Button>
      </Link>

      <h2 className="text-xl font-semibold mt-6 mb-2">Approved Schedules</h2>

      {loading ? (
        <Loader2 className="animate-spin" />
      ) : requests.length > 0 ? (
        requests.map(request => (
          <div key={request._id} className="bg-green-50 border border-green-300 p-4 rounded shadow mb-3">
            <p className="flex items-center gap-1 text-green-700 font-medium">
              <BadgeCheck size={18} /> Approved Schedule
            </p>
            <pre className="whitespace-pre-wrap text-sm mt-2">{request.schedule}</pre>
          </div>
        ))
      ) : (
        <p>No approved schedules yet.</p>
      )}
    </div>
  )
}
