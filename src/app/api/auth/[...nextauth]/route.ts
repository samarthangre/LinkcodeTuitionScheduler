import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
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

        const user = users.find(
          (u) => u.email === credentials?.email && u.password === credentials?.password
        )
        if (user) return user
        return null
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
      if (session.user) session.user.role = token.role
      return session
    },
  },
})

export { handler as GET, handler as POST }
