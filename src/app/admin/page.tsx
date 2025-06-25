'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [lectures, setLectures] = useState<any[]>([])
  const [requests, setRequests] = useState<any[]>([])

  useEffect(() => {
    if (status === 'loading') return
    if (!session) return router.push('/login')
    if (session.user?.role !== 'admin') return router.push('/')
  }, [session, status])

  useEffect(() => {
    const fetchData = async () => {
      const usersRes = await fetch('/api/users')
      const lecturesRes = await fetch('/api/lectures')
      const requestsRes = await fetch('/api/access-request')

      setUsers(await usersRes.json())
      setLectures(await lecturesRes.json())
      setRequests(await requestsRes.json())
    }
    fetchData()
  }, [])

  const handleApproval = async (id: string, approved: boolean) => {
    const res = await fetch('/api/access-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, approved }),
    })
    if (res.ok) {
      const updatedRequests = requests.map((req) =>
        req._id === id ? { ...req, approved } : req
      )
      setRequests(updatedRequests)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📊 Admin Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">👥 Users</h2>
        <ul className="space-y-2">
          {users.map((user, index) => (
            <li
              key={index}
              className="p-2 border rounded bg-white flex justify-between items-center"
            >
              <span>{user.email}</span>
              <span className="text-sm text-gray-500">{user.role}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">📚 Lectures</h2>
        <ul className="space-y-2">
          {lectures.map((lecture, index) => (
            <li key={index} className="p-2 border rounded bg-white">
              <p className="font-medium">{lecture.title}</p>
              <p className="text-sm text-gray-500">{lecture.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">📜 Access Requests</h2>
        <ul className="space-y-4">
          {requests.map((req: any, index: number) => (
            <li
              key={index}
              className="p-4 border rounded bg-white shadow-sm"
            >
              <p className="font-medium">{req.email}</p>
              <p className="text-sm text-gray-500">{req.reason}</p>
              {req.schedule && (
                <pre className="bg-gray-100 p-2 text-sm mt-2 whitespace-pre-wrap">
                  {req.schedule}
                </pre>
              )}
              {req.approved !== undefined ? (
                <p className={`mt-2 text-sm font-semibold ${req.approved ? 'text-green-600' : 'text-red-600'}`}>
                  {req.approved ? 'Approved' : 'Rejected'}
                </p>
              ) : (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleApproval(req._id, true)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(req._id, false)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
