'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) return router.push('/login')
    if (session.user?.role !== 'admin') return router.push('/')
  }, [session, status])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">🛠 Admin Dashboard</h1>
      <p className="mt-2 text-gray-600">Welcome, {session?.user?.email}</p>
    </div>
  )
}
