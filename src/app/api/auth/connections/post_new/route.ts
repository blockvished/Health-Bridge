// /src/app/api/auth/connections/schedule/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "../../../../lib/verify";
import { and, eq } from "drizzle-orm";
import {
  doctor,
  posts,
  post_social_platform,
  socialConnections,
  socialPlatforms,
  postStatusEnum,
} from "../../../../../db/schema";
import { db } from "../../../../../db/db";
import path, { extname } from "path";
import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { getAuthorURN, postUGC } from "../../../../../../scripts/linkedin";
import { postTweet } from "../../../../../../scripts/twit";

// Define the post status type to match the enum
type PostStatus = (typeof postStatusEnum.enumValues)[number];

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

    const connections = await db
      .select()
      .from(socialConnections)
      .where(
        and(
          eq(socialConnections.userId, userId),
          eq(socialConnections.disconnected, false)
        )
      );

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
    const platformStatuses: {
      postId: number;
      socialPlatformId: number;
      status: PostStatus;
      publishedAt: Date | null;
    }[] = [];

    // Process each selected social platform
    console.log("🔄 Processing selected social platforms...");
    for (const platformId of socialMedia) {
      console.log(`🌐 Processing platform ID: ${platformId}`);
      let status: PostStatus = "failed"; // Default status
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
          console.log(
            `❌ No connection found for platform ${platformProvider}`
          );
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
            status,
          });
          console.log(
            `✅ Added result for ${connection.provider} to postResults`
          );
        }

        // Store the post-platform relationship with actual status
        console.log(`💾 Storing status "${status}" for platform ${platformId}`);
        platformStatuses.push({
          postId,
          socialPlatformId: platformId,
          status: status as PostStatus, // Ensure it's properly typed
          publishedAt: status === "posted" ? currentTime : null,
        });
      } catch (error) {
        console.error(`❌ Error posting to platform ${platformId}:`, error);
        status = "failed";

        // Add the error to results
        postResults.push({
          platform: platformProviders[platformId] || `unknown-${platformId}`,
          error: (error as Error).message,
          status: "failed",
        });

        // Still record the attempt in database
        platformStatuses.push({
          postId,
          socialPlatformId: platformId,
          status: "failed",
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
    const anyPosted = platformStatuses.some((ps) => ps.status === "posted");
    const allFailed = platformStatuses.every((ps) => ps.status === "failed");

    let finalPostStatus: PostStatus = "posted";
    if (allFailed) {
      finalPostStatus = "failed";
    } else if (!anyPosted) {
      finalPostStatus = "posted";
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
