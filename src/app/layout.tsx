// ✅ /src/app/layout.tsx
import './globals.css'
import { SessionWrapper } from '@/components/session-wrapper'
import { ToasterWrapper } from '@/components/toaster-wrapper'

export const metadata = {
  title: 'Tuition Scheduler',
  description: 'Manage tuition schedules and chats',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>
          {children}
        </SessionWrapper>
        <ToasterWrapper />
      </body>
    </html>
  )
}
