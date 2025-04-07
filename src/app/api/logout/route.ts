import { NextResponse } from 'next/server'
import { serialize } from 'cookie'

export async function POST() {
  // Clear the authToken cookie
  const response = NextResponse.json({
    success: true,
    message: 'Logout successful',
  })

  response.headers.set(
    'Set-Cookie',
    serialize('authToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })
  )

  return response
}
