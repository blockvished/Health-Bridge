import { NextResponse } from "next/server";
import { db } from "../../../../../db/db";
import {
  posts,
  // post_social_platform,
  // socialPlatforms,
  doctor,
} from "../../../../../db/schema"; // Import necessary schemas
import { verifyAuthToken } from "../../../../lib/verify";
import { eq,  } from "drizzle-orm";

export async function GET() {
  const decodedOrResponse = await verifyAuthToken();

  if (decodedOrResponse instanceof NextResponse) {
    return decodedOrResponse;
  }

  const { userId } = decodedOrResponse;
  const numericUserId = Number(userId);

  const doctorData = await db
    .select()
    .from(doctor)
    .where(eq(doctor.userId, numericUserId));

  if (!doctorData.length) {
    return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
  }

  const requiredDoctorId = doctorData[0].id;

  try {
    const results = await db.query.posts.findMany({
      where: eq(posts.doctorId, requiredDoctorId),
      with: {
        postSocialPlatforms: {
          with: {
            socialPlatform: true,
          },
        },
      },
    });

    const simplifiedPosts = results.map((post) => ({
      ...post,
      postSocialPlatforms: post.postSocialPlatforms.map(
        (psp) => psp.socialPlatform.name
      ),
    }));

    return NextResponse.json({ posts: simplifiedPosts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts with platforms:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts with platforms" },
      { status: 500 }
    );
  }
}

// below is the schema for posts and social platforms and the relationship between them

// export const posts = pgTable("posts", {
//   id: serial("id").primaryKey(),
//   doctorId: integer("doctor_id") // changed to doctor_id
//     .notNull()
//     .references(() => doctor.id, { onDelete: "cascade" }), // changed to doctor
//   content: text("content").notNull(),
//   imageLocalLink: text("image_local_link"),
//   status: postStatusEnum("status").default("scheduled").notNull(), // 'scheduled', 'posted', 'failed'
//   interactions: integer("interactions").default(0),
//   publishedBy: varchar("published_by", { length: 255 }),
//   scheduledTime: timestamp("scheduled_time"),// bull mq
//   createdAt: timestamp("created_at").defaultNow(),
// });

// export const postRelations = relations(posts, ({ many }) => ({
//     postSocialPlatforms: many(post_social_platform),
// }));

// export const post_social_platform = pgTable(
//   "post_social_platform",
//   {
//     id: serial("id").primaryKey(),
//     postId: integer("post_id")
//       .notNull()
//       .references(() => posts.id, { onDelete: "cascade" }),
//     socialPlatformId: integer("social_platform_id")
//       .notNull()
//       .references(() => socialPlatforms.id, { onDelete: "cascade" }),
//     // Add any additional fields relevant to the relationship
//     // e.g., a timestamp for when the post was published on the platform
//     publishedAt: timestamp("published_at"),
//     // You might also want to track the status of the post on each platform
//     status: postStatusEnum("status").default("scheduled").notNull(),
//   },
//   (table) => ({
//     // Composite primary key (optional, if you want to enforce unique pairs)
//     // You might not need this if 'id' is already a primary key
//     // primaryKey: [table.postId, table.socialPlatformId],

//     //  indexes (optional, but recommended for performance)
//     postSocialPlatformIdIdx: index("post_social_platform_id_idx").on(
//       table.postId,
//       table.socialPlatformId
//     ),
//   })
// );

// export const postSocialPlatformRelations = relations(post_social_platform, ({ one }) => ({
//     post: one(posts, {
//         fields: [post_social_platform.postId],
//         references: [posts.id],
//     }),
//     socialPlatform: one(socialPlatforms, {
//         fields: [post_social_platform.socialPlatformId],
//         references: [socialPlatforms.id],
//     }),
// }));

// export const socialPlatforms = pgTable("social_platforms", {
//   id: serial("id").primaryKey(), // Use serial for auto-increment
//   name: varchar("name", { length: 255 }).notNull(), // e.g., 'Facebook', 'Twitter'
// });

// export const socialPlatformRelations = relations(socialPlatforms, ({ many }) => ({
//     postSocialPlatforms: many(post_social_platform),
// }));
