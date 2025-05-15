import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { twitterClient } from './twitter';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const returnedState = searchParams.get('state');

  const cookieStore = await cookies();
  const codeVerifier = cookieStore.get('codeVerifier')?.value;
  const storedState = cookieStore.get('state')?.value;

  if (!code || !codeVerifier || returnedState !== storedState) {
    return NextResponse.json({ error: 'Invalid or missing data' }, { status: 400 });
  }

  try {
    const {
      client: loggedClient,
      accessToken,
      refreshToken,
      expiresIn,
    } = await twitterClient.loginWithOAuth2({
      code,
      codeVerifier,
      redirectUri: 'http://localhost:3000/api/auth/twitter/callback',
    });

    const user = await loggedClient.v2.me();

    // Do something with user, accessToken, etc.
    console.log({
      twitterUserId: user.data.id,
      username: user.data.username,
      accessToken,
      refreshToken,
      expiresIn,
    });

    return NextResponse.redirect(new URL('http://localhost:3000/admin/posts/connections', request.url)); // ✅ Absolute URL
  } catch (error) {
    console.error('Twitter OAuth error:', error);
    return NextResponse.json({ error: 'Failed to authorize Twitter account' }, { status: 500 });
  }
}
