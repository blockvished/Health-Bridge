// /src/app/api/auth/connections/schedule/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "../../../../lib/verify";
import { eq } from "drizzle-orm";
import {
  doctor,
  posts,
  post_social_platform,
  socialConnections,
  socialPlatforms,
} from "../../../../../db/schema";
import { db } from "../../../../../db/db";
import path, { extname } from "path";
import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";

// LinkedIn posting functions
async function getAuthorURN(token: string): Promise<string> {
  console.log("🔍 BEGIN: Fetching LinkedIn author URN...");
  // Fetch profile via /userinfo
  try {
    const res = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log("📊 LinkedIn userinfo response status:", res.status);

    if (!res.ok) {
      console.error("❌ Failed fetching LinkedIn userinfo:", data);
      throw new Error(data.message || "LinkedIn userinfo error");
    }

    // data.sub is the member ID
    const urn = `urn:li:person:${data.sub}`;
    console.log("✅ LinkedIn Author URN successfully retrieved:", urn);
    return urn;
  } catch (error) {
    console.error("❌ Exception in getAuthorURN:", error);
    throw error;
  }
}

async function postUGC(
  token: string,
  authorURN: string,
  text: string,
  imageUrl?: string
) {
  console.log("🔍 BEGIN: Posting to LinkedIn UGC...");
  console.log("📝 Content:", text);
  console.log("🖼️ Image URL:", imageUrl || "None");

  // Create the UGC post
  const url = "https://api.linkedin.com/v2/ugcPosts";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body: any = {
    author: authorURN,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: { text },
        shareMediaCategory: imageUrl ? "IMAGE" : "NONE",
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  // Add image if provided
  if (imageUrl) {
    console.log("🖼️ Adding image to LinkedIn post:", imageUrl);
    body.specificContent["com.linkedin.ugc.ShareContent"].media = [
      {
        status: "READY",
        description: {
          text: "Image",
        },
        media: imageUrl,
        title: {
          text: "Posted Image",
        },
      },
    ];
  }

  try {
    console.log("📤 Sending LinkedIn UGC post request...");
    console.log("📦 Request body:", JSON.stringify(body));

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(body),
    });

    console.log("📊 LinkedIn post response status:", res.status);
    const data = await res.json();

    if (!res.ok) {
      console.error("❌ LinkedIn post failed:", data);
      throw new Error(data.message || "LinkedIn post error");
    }

    console.log("✅ LinkedIn post successful:", data);
    return data;
  } catch (error) {
    console.error("❌ Exception in postUGC:", error);
    throw error;
  }
}

// Twitter posting function
async function postTweet(
  accessToken: string,
  tweetText: string,
  imageUrl?: string
) {
  console.log("🔍 BEGIN: Posting to Twitter...");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body: any = {
    text: tweetText,
  };

  // Add image if provided
  if (imageUrl) {
    console.log(
      "⚠️ NOTE: Image posting to Twitter requires media upload first"
    );
    // Note: For Twitter, you'd typically need to upload the media first and then attach the media ID
    // This is simplified and would need to be expanded for actual image posting
    body.media = { media_ids: [imageUrl] };
    console.log(
      "⚠️ WARNING: Current implementation treats imageUrl as mediaId which won't work"
    );
  }

  try {
    console.log("📤 Sending Twitter post request...");
    console.log("📦 Request body:", JSON.stringify(body));

    const response = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("📊 Twitter response status:", response.status);
    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Failed to post tweet:", data);
      throw new Error(data.title || "Twitter API error");
    }

    console.log("✅ Twitter post successful:", data);
    return data;
  } catch (error) {
    console.error("❌ Exception in postTweet:", error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  console.log("🚀 POST request received");

  // Verify JWT token
  console.log("🔐 Verifying authentication token...");
  const decodedOrResponse = await verifyAuthToken();
  if (decodedOrResponse instanceof NextResponse) {
    return decodedOrResponse;
  }
  console.log("✅ Auth token verified successfully");

  const decoded = decodedOrResponse;
  const userId = Number(decoded.userId);

  const doctorData = await db
    .select()
    .from(doctor)
    .where(eq(doctor.userId, userId));

  if (!doctorData.length) {
    return NextResponse.json(
      { error: "Doctor profile not found for this user." },
      { status: 404 }
    );
  }

  const requiredDoctorId = doctorData[0].id;
  const doctorName = doctorData[0].name;
  console.log("👨‍⚕️ Doctor ID:", requiredDoctorId, "Name:", doctorName);

  const baseUploadPath = path.join(process.cwd(), "private_uploads");

  try {
    console.log("📑 Parsing form data...");
    const form = await req.formData();

    const content = form.get("content") as string | null;
    const socialMedia = JSON.parse(
      (form.get("socialMedia") as string | null) ?? "[]"
    ) as number[];
    const imageFile = form.get("image") as File | null;

    console.log("📝 Content:", content);
    console.log("🌐 Social Media IDs:", socialMedia);

    if (!content || socialMedia.length === 0) {
      console.log("❌ Missing required content or social media platforms");
      return NextResponse.json(
        { error: "Content and at least one social platform are required." },
        { status: 400 }
      );
    }

    let imageLocalLink: string | null = null;

    if (imageFile) {
      console.log("🖼️ Processing image file...");
      // Safely get the filename
      const originalFileName = imageFile.name;
      const fileExtension = extname(originalFileName || "") || ".png";
      const uniqueFilename = `${uuidv4()}${fileExtension}`;
      const uploadDir = path.join(
        baseUploadPath,
        "social_posts",
        String(userId)
      );
      const uploadPath = path.join(uploadDir, uniqueFilename);

      console.log("📂 Upload directory:", uploadDir);
      console.log("📄 Upload path:", uploadPath);

      // Ensure directory exists
      if (!fs.existsSync(uploadDir)) {
        console.log("📁 Creating directory:", uploadDir);
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Convert Blob to Buffer
      console.log("🔄 Converting Blob to Buffer...");
      const buffer = await blobToBuffer(imageFile);

      // Write the file using the standard fs.writeFileSync
      console.log("💾 Writing file to disk...");
      fs.writeFileSync(uploadPath, buffer);

      imageLocalLink = `/api/posted_image/${userId}/${uniqueFilename}`;
      console.log("🔗 Image local link:", imageLocalLink);
    }

    const platforms = await db.select().from(socialPlatforms);
    
    // Create an id→name map from the social platform data
    const platformProviders = platforms.reduce<Record<number, string>>(
      (map, plat) => {
        map[plat.id] = plat.name;
        return map;
      },
      {}
    );

    // Fetch user's social connections
    const connections = await db
      .select()
      .from(socialConnections)
      .where(eq(socialConnections.userId, userId))
      .where(eq(socialConnections.disconnected, false));

    console.log("🔗 Found connections:", connections.length);
    connections.forEach((conn, i) => {
      console.log(`Connection ${i + 1}: provider=${conn.provider}`);
    });

    // Create the post record first
    console.log("💾 Creating post record in database...");
    const currentTime = new Date();
    const newPost = await db
      .insert(posts)
      .values({
        doctorId: requiredDoctorId,
        content: content,
        imageLocalLink: imageLocalLink,
        scheduledTime: null,
        publishedTime: currentTime, // Set to current time since we're posting immediately
        status: "posted", // Change status to posted immediately
        publishedBy: doctorName,
      })
      .returning({ id: posts.id });

    if (newPost.length === 0) {
      console.log("❌ Failed to save post to database");
      return NextResponse.json(
        { error: "Failed to save the post." },
        { status: 500 }
      );
    }

    const postId = newPost[0].id;
    console.log("✅ Post saved to database with ID:", postId);

    // Post to social media platforms immediately based on selection
    const postResults = [];
    const platformStatuses = [];

    // Process each selected social platform
    console.log("🔄 Processing selected social platforms...");
    for (const platformId of socialMedia) {
      console.log(`🌐 Processing platform ID: ${platformId}`);
      let status = "pending";
      let result = null;

      try {
        // Find connection for this platform
        const platformProvider = platformProviders[platformId];
        
        if (!platformProvider) {
          console.log(`❌ Unknown platform ID: ${platformId}`);
          status = "failed";
          postResults.push({
            platform: `unknown-${platformId}`,
            error: "Unknown platform ID",
          });
          continue;
        }
        
        console.log(`🔍 Looking for ${platformProvider} connection`);

        // Find the matching connection
        const connection = connections.find(
          (conn) => conn.provider === platformProvider
        );

        if (!connection) {
          console.log(`❌ No connection found for platform ${platformProvider}`);
          status = "failed";
          postResults.push({
            platform: platformProvider,
            error: "No active connection found",
          });
        } else if (!connection.accessToken) {
          console.log(`❌ No access token for platform ${platformProvider}`);
          status = "failed";
          postResults.push({
            platform: platformProvider,
            error: "No valid access token",
          });
        } else {
          console.log(`✅ Found connection for ${connection.provider}`);
          console.log(`🔑 Access token available: ${!!connection.accessToken}`);

          // Post based on platform type
          switch (connection.provider) {
            case "linkedin": {
              console.log("🔄 Posting to LinkedIn...");
              const authorURN = await getAuthorURN(connection.accessToken);
              console.log("📤 Got LinkedIn author URN, posting content...");
              result = await postUGC(
                connection.accessToken,
                authorURN,
                content,
                imageLocalLink || undefined
              );
              console.log("✅ LinkedIn post successful");
              status = "posted";
              break;
            }

            case "twitter": {
              console.log("🔄 Posting to Twitter...");
              result = await postTweet(
                connection.accessToken,
                content,
                imageLocalLink || undefined
              );
              console.log("✅ Twitter post successful");
              status = "posted";
              break;
            }

            default:
              // For other platforms, just log for now
              console.log(
                `⚠️ Posting to ${connection.provider} is not implemented yet. Content: ${content}`
              );
              status = "failed"; // Mark as failed since we can't actually post
              result = { message: "Platform not implemented" };
          }

          postResults.push({ 
            platform: connection.provider, 
            result,
            status
          });
          console.log(`✅ Added result for ${connection.provider} to postResults`);
        }

        // Store the post-platform relationship with actual status
        console.log(`💾 Storing status "${status}" for platform ${platformId}`);
        platformStatuses.push({
          postId,
          socialPlatformId: platformId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          status: status as any,
          publishedAt: status === "posted" ? currentTime : null,
        });
      } catch (error) {
        console.error(`❌ Error posting to platform ${platformId}:`, error);
        status = "failed";
        
        // Add the error to results
        postResults.push({
          platform: platformProviders[platformId] || `unknown-${platformId}`,
          error: (error as Error).message,
          status: "failed"
        });
        
        // Still record the attempt in database
        platformStatuses.push({
          postId,
          socialPlatformId: platformId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          status: "failed" as any,
          publishedAt: null,
        });
      }
    }

    // Insert all platform relationships
    if (platformStatuses.length > 0) {
      console.log("💾 Inserting platform relationships to database...");
      await db.insert(post_social_platform).values(platformStatuses);
      console.log("✅ Platform relationships saved to database");
    } else {
      console.log("ℹ️ No platform relationships to save");
    }

    // Update the main post status based on platform results
    const anyPosted = platformStatuses.some(ps => ps.status === "posted");
    const allFailed = platformStatuses.every(ps => ps.status === "failed");
    
    let finalPostStatus = "posted";
    if (allFailed) {
      finalPostStatus = "failed";
    } else if (!anyPosted) {
      finalPostStatus = "pending";
    }
    
    if (finalPostStatus !== "posted") {
      console.log(`📝 Updating post status to: ${finalPostStatus}`);
      await db
        .update(posts)
        .set({ status: finalPostStatus })
        .where(eq(posts.id, postId));
    }

    console.log("🏁 Completed processing post. Returning 200 status.");
    return NextResponse.json(
      {
        message: "Post processing completed",
        postId,
        status: finalPostStatus,
        results: postResults,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error publishing post:", err);
    return NextResponse.json(
      {
        message: "Server error while publishing post",
        error: (err as Error).message,
      },
      { status: 500 }
    );
  }
}

// function slugify(str: string) {
//   return str
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-|-$/g, "");
// }

async function blobToBuffer(blob: Blob): Promise<Buffer> {
  console.log("🔄 Converting Blob to Buffer...");
  if (blob && typeof blob.arrayBuffer === "function") {
    console.log("📦 Using arrayBuffer method");
    const arrayBuffer = await blob.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } else {
    // Fallback for environments where arrayBuffer is not available
    console.log("📦 Using text fallback method");
    const text = await blob.text();
    return Buffer.from(text);
  }
}