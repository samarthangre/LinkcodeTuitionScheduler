'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import io from 'socket.io-client'

let socket: any

export default function StudentChatPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState<any[]>([])
  const [content, setContent] = useState('')
  const [schedule, setSchedule] = useState('')
  const [showApproval, setShowApproval] = useState(false)

  const recipient = 'tutor@test.com'

  useEffect(() => {
    if (!session) return router.push('/login')

    socket = io()

    socket.on('message:new', (msg: any) => {
      if (msg.sender === recipient) {
        setMessages((prev) => [...prev, msg])
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(`/api/messages?recipient=${recipient}`)
      const data = await res.json()
      setMessages(data)
    }
    fetchMessages()
  }, [])

  const sendMessage = async () => {
    const message = {
      sender: session?.user?.email,
      recipient,
      content,
    }

    setMessages((prev) => [...prev, { ...message }])
    socket.emit('message:send', message)
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    })

    setContent('')
  }

  const requestApproval = async () => {
    await fetch('/api/access-request', {
      method: 'POST',
      body: JSON.stringify({
        email: session?.user?.email,
        reason: 'Wants to join lecture',
        schedule,
      }),
    })
    alert('Request sent to Admin!')
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">💬 Chat with Tutor</h1>
      <div className="border p-4 mb-4 rounded h-80 overflow-y-auto bg-white">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2">
            <strong>{msg.sender === session?.user?.email ? 'You' : 'Tutor'}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>

      <textarea
        className="w-full p-2 border rounded mb-2"
        rows={3}
        value={schedule}
        onChange={(e) => setSchedule(e.target.value)}
        placeholder="Paste the final schedule here..."
      ></textarea>

      <button
        onClick={requestApproval}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        Request Admin Approval
      </button>
    </div>
  )
}
