'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function TutorChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState<any[]>([])
  const [content, setContent] = useState('')
  const recipient = 'student@test.com'

  useEffect(() => {
    if (status === 'loading') return
    if (!session) return router.push('/login')
    if (session.user?.role !== 'tutor') return router.push('/')
  }, [session, status])

  const loadMessages = async () => {
    const res = await fetch(`/api/messages?recipient=${recipient}`)
    const data = await res.json()
    setMessages(data)
  }

  useEffect(() => {
    loadMessages()
  }, [])

  const sendMessage = async () => {
    if (!content.trim()) return
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient, content }),
    })
    setContent('')
    loadMessages()
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">💬 Chat with Student</h2>
      <div className="border rounded p-4 h-64 overflow-y-auto bg-white mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 p-2 rounded max-w-xs ${
              msg.sender === session?.user?.email ? 'bg-green-100 ml-auto' : 'bg-gray-200'
            }`}
          >
            <p className="text-sm">{msg.content}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  )
}
