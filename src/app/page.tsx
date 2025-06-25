'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const handleLogin = (role: string) => {
    router.push(`/login?role=${role}`)
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        👩‍🏫 Linkcode Tuition Scheduler
      </h1>
      <p className="mb-8 text-center text-gray-600 max-w-md">
        A seamless communication platform between students and tutors to
        schedule lectures efficiently.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={() => handleLogin('student')}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          🎓 Student Login
        </button>
        <button
          onClick={() => handleLogin('tutor')}
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          📘 Tutor Login
        </button>
        <button
          onClick={() => handleLogin('admin')}
          className="bg-gray-800 text-white py-2 rounded hover:bg-gray-900"
        >
          🛠️ Admin Login
        </button>
      </div>
    </main>
  )
}
