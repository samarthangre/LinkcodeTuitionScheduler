'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Users } from 'lucide-react'

export default function TutorDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tutor Dashboard</h1>

      <Link href="/tutor/chat">
        <Button className="mb-4">
          <Users className="mr-2 h-4 w-4" /> Chat with Students
        </Button>
      </Link>

      <p>Welcome, tutor! You can chat with students or manage your lectures.</p>
    </div>
  )
}
