// ✅ /src/app/student/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { useRouter } from 'next/navigation'

interface AccessRequest {
  _id: string
  student: string
  studentEmail: string
  schedule: string
  status: string
}

export default function StudentDashboard() {
  const [approved, setApproved] = useState<AccessRequest[]>([])
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await axios.get('/api/access-requests')
        console.log('API response:', res.data) // ✅ DEBUG
        const approved = res.data.requests.filter(
          (req: AccessRequest) =>
            req.status === 'approved' &&
            (req.studentEmail === session?.user?.email ||
             req.student === session?.user?.email)
        )
        setApproved(approved)
      } catch (err) {
        console.error('Failed to fetch schedules:', err)
      }
    }

    fetchSchedules()
  }, [session])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>

      <Button onClick={() => router.push('/student/chat')} className="mb-6">
        Go to Chat
      </Button>

      <h2 className="text-xl font-semibold mb-2">Approved Lectures</h2>

      {approved.length > 0 ? (
        <ul className="list-disc pl-5 space-y-2">
          {approved.map((req) => (
            <li key={req._id} className="bg-gray-100 p-3 rounded">
              <pre className="whitespace-pre-wrap">{req.schedule}</pre>
            </li>
          ))}
        </ul>
      ) : (
        <p>No approved lectures yet.</p>
      )}
    </div>
  )
}
