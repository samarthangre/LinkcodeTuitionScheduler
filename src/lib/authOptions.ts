// src/lib/auth.ts
import CredentialsProvider from 'next-auth/providers/credentials'
import { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const users = [
          { id: '1', email: 'admin@test.com', password: 'admin', role: 'admin' },
          { id: '2', email: 'tutor@test.com', password: 'tutor', role: 'tutor' },
          { id: '3', email: 'student@test.com', password: 'student', role: 'student' },
        ]
        return users.find(
          (u) =>
            u.email === credentials?.email && u.password === credentials?.password
        ) || null
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role
      return token
    },
    async session({ session, token }) {
      if (session.user) session.user.role = token.role as string
      return session
    },
  },
}
