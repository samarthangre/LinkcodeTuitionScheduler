// ✅ src/app/api/schedule-from-chat/route.ts
import { NextResponse } from 'next/server'
import axios from 'axios'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const model = 'llama3-70b-8192'

export async function POST(req: Request) {
  const { messages } = await req.json()

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: 'Invalid message format' }, { status: 400 })
  }

  const prompt = `
You're an assistant for a tuition platform. Based on the following chat, generate a clear class schedule.
Chat:
${messages.map((m: any) => `${m.sender}: ${m.content}`).join('\n')}

Return the schedule in this format:
Subject: [subject]
Days: [Mon/Wed/Fri or specific days]
Time: [HH:MM AM/PM]
Duration: [e.g., 1 hour]
Mode: [Online/Offline]
`

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model,
        messages: [
          { role: 'system', content: 'You are a helpful AI that extracts schedules from chat.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const schedule = response.data.choices[0]?.message?.content
    return NextResponse.json({ schedule })
  } catch (error: any) {
    console.error('❌ Groq API Error:', error.response?.data || error.message)
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 })
  }
}
