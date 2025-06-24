// /src/lib/authRedirect.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'

export async function protectRoute(requiredRole: string) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== requiredRole) {
    redirect('/login')
  }
  return session
}
