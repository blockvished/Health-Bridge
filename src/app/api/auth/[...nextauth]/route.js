import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import LinkedInProvider from "next-auth/providers/linkedin";
import FacebookProvider from "next-auth/providers/facebook";
import InstagramProvider from "next-auth/providers/instagram";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      version: "2.0", // Important: use Twitter OAuth 2.0
      checks: ["pkce", "state"],
      authorization: {
        params: {
          scope: [
            "tweet.read",
            "tweet.write",
            "users.read",
            "offline.access", // for refresh tokens
            "media.write", // <— critical for v2 media upload :contentReference[oaicite:3]{index=3}
          ].join(" "),
        },
      },
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      issuer: "https://www.linkedin.com",
      profile: (profile) => ({
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }),
      wellKnown:
        "https://www.linkedin.com/oauth/.well-known/openid-configuration",
      authorization: {
        params: {
          scope: "openid profile email w_member_social",
        },
      },
    }),
    GoogleProvider({
      id: "google-business",
      name: "Google Business",
      clientId: process.env.GOOGLE_BUSINESS_CLIENT_ID,
      clientSecret: process.env.GOOGLE_BUSINESS_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/business.manage",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),

    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      authorization: {
        params: {
          scope: [
            "pages_show_list",
          ].join(",")
        }
      }
    }),

    InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Store provider and access tokens in JWT
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.provider = account.provider; // Store which provider was used
      }
      return token;
    },
    async session({ session, token }) {
      // Send tokens and provider info to client
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.expiresAt = token.expiresAt;
      session.provider = token.provider; // Include provider in session
      return session;
    },
  },
  // Allow users to sign in with multiple accounts
  pages: {
    signIn: "/auth/signin", // Custom sign-in page (optional)
  },
});

export { handler as GET, handler as POST };
