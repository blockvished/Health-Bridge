import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const token = body.token
  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  if (!token || !secretKey) {
    return NextResponse.json({ success: false, error: 'Missing token or secret key' }, { status: 400 })
  }

  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify`
  const formData = new URLSearchParams()
  formData.append('secret', secretKey)
  formData.append('response', token)

  const googleRes = await fetch(verificationUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData,
  })

  const data = await googleRes.json()

  if (data.success) {
    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ success: false, errors: data['error-codes'] }, { status: 400 })
  }
}
