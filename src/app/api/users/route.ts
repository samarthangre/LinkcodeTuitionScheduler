// src/app/api/users/route.ts
export async function GET() {
  const users = [
    { email: 'admin@test.com', role: 'admin' },
    { email: 'student@test.com', role: 'student' },
    { email: 'tutor@test.com', role: 'tutor' },
  ]
  return Response.json(users)
}
