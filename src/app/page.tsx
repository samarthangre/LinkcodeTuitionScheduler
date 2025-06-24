// src/app/page.tsx

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-6 text-gray-800">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-bold mb-4">🎓 Welcome to Tuition Scheduler</h1>
        <p className="text-lg mb-6">
          Plan lectures, communicate seamlessly, and manage your tuition sessions.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/login">
            <button className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
              Login
            </button>
          </Link>
          <Link href="/student">
            <button className="px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700">
              Student Dashboard
            </button>
          </Link>
          <Link href="/tutor">
            <button className="px-6 py-2 rounded bg-purple-600 text-white hover:bg-purple-700">
              Tutor Dashboard
            </button>
          </Link>
        </div>
      </div>
    </main>
  )
}
