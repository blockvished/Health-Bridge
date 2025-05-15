// src/api/auth/twitter/route.ts
import { TwitterApi } from 'twitter-api-v2';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const client = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID!,
    clientSecret: process.env.TWITTER_CLIENT_SECRET!,
  });

  const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
    'http://localhost:3000/api/auth/twitter/callback',
    {
      scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
    }
  );

  const res = NextResponse.redirect(url);

  // Save codeVerifier and state in cookies (or session/db)
  res.cookies.set('codeVerifier', codeVerifier, {
    httpOnly: true,
    path: '/',
  });
  res.cookies.set('state', state, {
    httpOnly: true,
    path: '/',
  });

  return res;
}
