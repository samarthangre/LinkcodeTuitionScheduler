import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      role?: 'admin' | 'tutor' | 'student'
    }
  }

  interface User {
    id: string
    email: string
    password: string
    role: 'admin' | 'tutor' | 'student'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: 'admin' | 'tutor' | 'student'
  }
}
