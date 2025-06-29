'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import axios from 'axios'

interface Request {
  _id: string
  student: string
  status: 'pending' | 'approved' | 'rejected'
  schedule: string
}

export default function AdminPage() {
  const [requests, setRequests] = useState<Request[]>([])

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get('/api/access-requests')
        setRequests(res.data)
      } catch (error) {
        console.error('Failed to fetch requests:', error)
      }
    }

    fetchRequests()
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
      <h1 className="text-2xl font-bold mb-4">Access Requests</h1>
      <div className="grid gap-4">
        {Array.isArray(requests) && requests.length > 0 ? (
          requests.map(request => (
            <Card key={request._id} className="shadow-md">
              <CardContent className="p-4">
                <p className="mb-2 font-semibold">Student: {request.student}</p>
                <pre className="bg-gray-100 p-2 text-sm rounded whitespace-pre-wrap mb-2">
                  {request.schedule}
                </pre>
                <p className="mb-2">Status: <strong>{request.status}</strong></p>
                {request.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      onClick={() => updateStatus(request._id, 'approved')}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => updateStatus(request._id, 'rejected')}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No access requests found.</p>
        )}
      </div>
    </div>
  )
}
