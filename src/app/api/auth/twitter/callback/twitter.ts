import { TwitterApi } from 'twitter-api-v2';

// Only needed if you want to do app-level actions (not OAuth)
export const appClient = new TwitterApi({
  appKey: process.env.TWITTER_CLIENT_ID!,
  appSecret: process.env.TWITTER_CLIENT_SECRET!,
});

// Used to initiate OAuth2 login
export const twitterClient = new TwitterApi({
  clientId: process.env.TWITTER_CLIENT_ID!,
  clientSecret: process.env.TWITTER_CLIENT_SECRET!,
});
