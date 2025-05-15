// This API route handles toggling autoposting for a specific platform
// Place this file at /app/api/social/[platform]/autoposting/route.js

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req, { params }) {
  const { platform } = params;
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  try {
    // Parse the request body to get the enabled status
    const { enabled } = await req.json();
    
    // Here you would update the user's preferences in your database
    // This is a simplified example - in a real app, you would:
    // 1. Update the autoposting setting in your database
    // 2. Update any provider-specific settings if needed
    
    /*
    // Example using Prisma
    await prisma.account.update({
      where: {
        userId_provider: {
          userId: session.user.id,
          provider: platform
        }
      },
      data: {
        autoposting: enabled
      }
    });
    */
    
    return new Response(JSON.stringify({ 
      success: true,
      platform,
      autoposting: enabled
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error(`Error updating autoposting for ${platform}:`, error);
    return new Response(JSON.stringify({ 
      error: "Failed to update autoposting settings"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}