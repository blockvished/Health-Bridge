// /src/app/api/auth/connections/schedule/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "../../../../lib/verify";
import { eq } from "drizzle-orm";
import { doctor, posts, post_social_platform } from "../../../../../db/schema";
import { db } from "../../../../../db/db";
import path, { extname } from "path";
import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  // Verify JWT token
  const decodedOrResponse = await verifyAuthToken();
  if (decodedOrResponse instanceof NextResponse) {
    return decodedOrResponse;
  }
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
  const baseUploadPath = path.join(process.cwd(), "private_uploads");

  try {
    const form = await req.formData();

    const content = form.get("content") as string | null;
    const socialMedia = JSON.parse(
      (form.get("socialMedia") as string | null) ?? "[]"
    ) as number[];
    const scheduleTime = form.get("scheduleTime") as string | null;
    const imageFile = form.get("image") as File | null;

    let imageLocalLink: string | null = null;

    if (imageFile) {
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

      // Ensure directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Convert Blob to Buffer
      const buffer = await blobToBuffer(imageFile);

      // Write the file using the standard fs.writeFileSync
      fs.writeFileSync(uploadPath, buffer);

      imageLocalLink = `/api/posted_image/${userId}/${uniqueFilename}`;
    }
    console.log({ content, socialMedia, scheduleTime, imageFile });

    const newPost = await db
      .insert(posts)
      .values({
        doctorId: requiredDoctorId,
        content: content!,
        imageLocalLink: imageLocalLink,
        scheduledTime: scheduleTime ? new Date(scheduleTime) : null,
        publishedBy: doctorName,
      })
      .returning({ id: posts.id });

    if (newPost.length > 0) {
      const postId = newPost[0].id;

      // Store the post to social platform relationships
      const postSocialPlatformData = socialMedia.map((socialPlatformId) => ({
        postId: postId,
        socialPlatformId: socialPlatformId,
        status: "scheduled" as const, // Explicitly cast to the enum type
      }));

      await db.insert(post_social_platform).values(postSocialPlatformData);

      return NextResponse.json(
        { message: "Post scheduled successfully", postId: postId },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to save the post." },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Error scheduling post:", err);
    return NextResponse.json(
      { message: "Server error while scheduling post" },
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
  if (blob && typeof blob.arrayBuffer === "function") {
    const arrayBuffer = await blob.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } else {
    // Fallback for environments where arrayBuffer is not available
    const text = await blob.text();
    return Buffer.from(text);
  }
}
