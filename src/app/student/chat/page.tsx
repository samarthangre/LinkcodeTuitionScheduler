'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import io from 'socket.io-client'

let socket: any

export default function StudentChatPage() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<any[]>([])
  const [content, setContent] = useState('')
  const [generatedSchedule, setGeneratedSchedule] = useState('')

  const recipient = 'tutor@test.com'

  useEffect(() => {
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

  const handleSend = async () => {
    if (!content.trim()) return

    const newMessage = {
      sender: session?.user?.email,
      recipient,
      content,
    }

    setMessages((prev) => [...prev, newMessage])
    setContent('')

    socket.emit('message:send', newMessage)
    await fetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify(newMessage),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  const handleGenerateSchedule = async () => {
    const res = await fetch('/api/schedule-from-chat', {
      method: 'POST',
      body: JSON.stringify({ messages }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await res.json()
    setGeneratedSchedule(data.schedule)
  }

  const handleRequestAccess = async () => {
    const res = await fetch('/api/access-requests', {
      method: 'POST',
      body: JSON.stringify({ schedule: generatedSchedule }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (res.ok) {
      alert('Access request sent to admin!')
    } else {
      alert('Failed to send request.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">💬 Student Chat</h1>

      <div className="space-y-2 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded ${
              msg.sender === session?.user?.email
                ? 'bg-blue-100 text-right'
                : 'bg-gray-100 text-left'
            }`}
          >
            <p className="text-xs text-gray-500">
              {msg.sender === session?.user?.email ? 'You' : msg.sender}
            </p>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 border p-2 rounded"
          placeholder="Type your message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSend}
        >
          Send
        </button>
      </div>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        onClick={handleGenerateSchedule}
      >
        Generate Schedule
      </button>

      {generatedSchedule && (
        <>
          <div className="p-4 border rounded bg-green-50 text-sm mb-4">
            <strong>Generated Schedule:</strong>
            <pre className="whitespace-pre-wrap mt-2">{generatedSchedule}</pre>
          </div>

          <button
            className="bg-purple-600 text-white px-4 py-2 rounded"
            onClick={handleRequestAccess}
          >
            Request Admin Approval
          </button>
        </>
      )}
    </div>
  )
}
