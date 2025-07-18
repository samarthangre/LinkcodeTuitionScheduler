'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { CheckCircle, XCircle, Loader2, User, Book } from 'lucide-react'

interface Request {
  _id: string
  student: string
  schedule: string
  status: 'pending' | 'approved' | 'rejected'
}

interface UserItem {
  _id: string
  email: string
  role: string
}

interface Lecture {
  _id: string
  title: string
  description: string
}

export default function AdminPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [users, setUsers] = useState<UserItem[]>([])
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, usersRes, lecturesRes] = await Promise.all([
          axios.get('/api/access-requests'),
          axios.get('/api/users'),
          axios.get('/api/lectures'),
        ])
        setRequests(reqRes.data.requests)
        setUsers(usersRes.data)
        setLectures(lecturesRes.data)
      } catch (error) {
        console.error('Failed to fetch admin data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await axios.put(`/api/access-requests/${id}`, { status })
      setRequests(prev =>
        prev.map(req => (req._id === id ? { ...req, status } : req))
      )
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      <h2 className="text-xl font-semibold mt-6 mb-2">Access Requests</h2>

      {loading ? (
        <Loader2 className="animate-spin" />
      ) : requests.length > 0 ? (
        requests.map(request => (
          <Card key={request._id} className="shadow-md mb-3">
            <CardContent className="p-4">
              <p className="mb-2 font-semibold">👤 Student: {request.student}</p>
              <pre className="bg-gray-100 p-2 text-sm rounded whitespace-pre-wrap mb-2">
                {request.schedule}
              </pre>
              <p className="mb-2">
                Status:{' '}
                <span
                  className={
                    request.status === 'approved'
                      ? 'text-green-600 font-semibold'
                      : request.status === 'rejected'
                      ? 'text-red-600 font-semibold'
                      : 'text-yellow-600 font-semibold'
                  }
                >
                  {request.status}
                </span>
              </p>
              {request.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    onClick={() => updateStatus(request._id, 'approved')}
                  >
                    <CheckCircle className="mr-1 h-4 w-4" /> Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => updateStatus(request._id, 'rejected')}
                  >
                    <XCircle className="mr-1 h-4 w-4" /> Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No access requests found.</p>
      )}

      <h2 className="text-xl font-semibold mt-8 mb-2">Users</h2>

      {users.length > 0 ? (
        users.map(user => (
          <Card key={user._id} className="shadow mb-3">
            <CardContent className="p-4 flex items-center gap-2">
              <User className="text-blue-600" />
              <div>
                <p className="font-medium">{user.email}</p>
                <p className="text-sm text-gray-500">Role: {user.role}</p>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No users found.</p>
      )}

      <h2 className="text-xl font-semibold mt-8 mb-2">Lectures</h2>

      {lectures.length > 0 ? (
        lectures.map(lecture => (
          <Card key={lecture._id} className="shadow mb-3">
            <CardContent className="p-4 flex items-start gap-2">
              <Book className="text-purple-600 mt-1" />
              <div>
                <p className="font-medium">{lecture.title}</p>
                <p className="text-sm text-gray-500">{lecture.description}</p>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No lectures found.</p>
      )}
    </div>
  )
}
