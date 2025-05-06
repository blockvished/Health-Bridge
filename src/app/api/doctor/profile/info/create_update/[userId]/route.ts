import fs from "fs";
import path from "path";
import { extname } from "path";
import { NextRequest, NextResponse } from "next/server";
import { IncomingForm } from "formidable";
import { Readable } from "stream";
import { eq, and, inArray } from "drizzle-orm";
import db from "../../../../../../../db/db";
import { verifyAuthToken } from "../../../../../../lib/verify";
import { IncomingMessage } from "http";

import {
  doctor,
  doctorMetaTags as dbMetaTags,
} from "../../../../../../../db/schema";

export const config = {
  api: {
    bodyParser: false,
  },
};

function createNodeRequest(req: NextRequest): Promise<IncomingMessage> {
  return new Promise(async (resolve) => {
    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);

    // Build a mock IncomingMessage
    const nodeReq = readable as IncomingMessage;
    nodeReq.headers = Object.fromEntries(req.headers.entries());
    nodeReq.method = req.method;

    resolve(nodeReq);
  });
}

// Define a proper type for the doctor fields that matches the database schema
type DoctorUpdateValues = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  specialization?: string | null;
  degree?: string | null;
  experience?: number | null;
  aboutSelf?: string | null;
  aboutClinic?: string | null;
  image_link?: string | null;
  signature_link?: string | null;
  linkedin_link?: string | null;
  facebook_link?: string | null;
  instagram_link?: string | null;
  twitter_link?: string | null;
  seo_description?: string | null;
};

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const userIdFromUrl = req.nextUrl.pathname.split("/").pop() || "unknown";
    // Verify JWT token using the modularized function
    const decodedOrResponse = await verifyAuthToken();

    // Handle potential error response from token verification
    if (decodedOrResponse instanceof NextResponse) {
      return decodedOrResponse;
    }

    const decoded = decodedOrResponse;
    const userId = Number(decoded.userId);

    if (String(userId) != userIdFromUrl) {
      // Optional: match doctor ID
      return NextResponse.json(
        { error: "Forbidden: Token-user mismatch" },
        { status: 403 }
      );
    }

    const nodeReq = await createNodeRequest(req);

    // Use a properly typed promise
    const response: Response = await new Promise((resolve) => {
      const form = new IncomingForm({ multiples: false });

      form.parse(nodeReq, async (err, fields, files) => {
        if (err) {
          console.error("Form parse error:", err);
          resolve(NextResponse.json({ error: "Form parse error" }, { status: 500 }));
          return;
        }

        try {
          const ExistingDoctor = await db
            .select()
            .from(doctor)
            .where(eq(doctor.userId, Number(decoded.userId)));

          const {
            name,
            email,
            phone,
            city,
            specialization,
            degree,
            experience,
            aboutSelf,
            aboutClinic,
            facebook,
            twitter,
            instagram,
            linkedin,
            seoDescription,
            doctorMetaTags,
          } = fields;

          const metaTagsString = Array.isArray(doctorMetaTags)
            ? doctorMetaTags[0]
            : doctorMetaTags;

          const baseUploadPath = path.join(process.cwd(), "private_uploads");
          const pictureFile = Array.isArray(files.profileImage)
            ? files.profileImage[0]
            : files.profileImage;
          const signatureFile = Array.isArray(files.signatureImage)
            ? files.signatureImage[0]
            : files.signatureImage;

          let pictureLink: string | null = null;
          let signatureLink: string | null = null;

          if (pictureFile && pictureFile.filepath) {
            const picExt = extname(pictureFile.originalFilename || "") || ".png";
            const picPath = path.join(
              baseUploadPath,
              "pictures",
              `${decoded.userId}_picture${picExt}`
            );
            await fs.promises.mkdir(path.dirname(picPath), { recursive: true });
            await fs.promises.rename(pictureFile.filepath, picPath);
            pictureLink = `/api/doctor/profile/info/images/${decoded.userId}/${decoded.userId}_picture${picExt}`;
          }

          if (signatureFile && signatureFile.filepath) {
            const sigExt = extname(signatureFile.originalFilename || "") || ".png";
            const sigPath = path.join(
              baseUploadPath,
              "signatures",
              `${decoded.userId}_signature${sigExt}`
            );
            await fs.promises.mkdir(path.dirname(sigPath), { recursive: true });
            await fs.promises.rename(signatureFile.filepath, sigPath);
            signatureLink = `/api/doctor/profile/info/images/${decoded.userId}/${decoded.userId}_signature${sigExt}`;
          }
          const experienceValue = Array.isArray(experience)
            ? experience[0]
            : experience;

          // Build update/insert object based on received fields
          const updateValues: DoctorUpdateValues = {};
          
          // Convert array values to string values to match the database schema
          if (name) updateValues.name = Array.isArray(name) ? name[0] : name;
          if (email) updateValues.email = Array.isArray(email) ? email[0] : email;
          if (phone) updateValues.phone = Array.isArray(phone) ? phone[0] : phone;
          if (city) updateValues.city = Array.isArray(city) ? city[0] : city;
          if (specialization) updateValues.specialization = Array.isArray(specialization) ? specialization[0] : specialization;
          if (degree) updateValues.degree = Array.isArray(degree) ? degree[0] : degree;

          if (experienceValue !== undefined && experienceValue !== "") {
            updateValues.experience = Number(experienceValue);
          }

          if (aboutSelf) updateValues.aboutSelf = Array.isArray(aboutSelf) ? aboutSelf[0] : aboutSelf;
          if (aboutClinic) updateValues.aboutClinic = Array.isArray(aboutClinic) ? aboutClinic[0] : aboutClinic;
          if (pictureLink) updateValues.image_link = pictureLink;
          if (signatureLink) updateValues.signature_link = signatureLink;

          if (linkedin) updateValues.linkedin_link = Array.isArray(linkedin) ? linkedin[0] : linkedin;
          if (facebook) updateValues.facebook_link = Array.isArray(facebook) ? facebook[0] : facebook;
          if (instagram) updateValues.instagram_link = Array.isArray(instagram) ? instagram[0] : instagram;
          if (twitter) updateValues.twitter_link = Array.isArray(twitter) ? twitter[0] : twitter;
          if (seoDescription) updateValues.seo_description = Array.isArray(seoDescription) ? seoDescription[0] : seoDescription;

          if (ExistingDoctor.length === 0) {
            await db.insert(doctor).values({
              userId,
              ...updateValues,
            });
          } else if (Object.keys(updateValues).length > 0) {
            await db
              .update(doctor)
              .set(updateValues)
              .where(eq(doctor.userId, userId));
          }

          if (metaTagsString && seoDescription) {
            const metaTagsArray = typeof metaTagsString === 'string' 
              ? metaTagsString
                  .split(",")
                  .map((tag: string) => tag.trim())
                  .filter((tag: string) => tag.length > 0)
              : [];

            const doctorData = await db
              .select()
              .from(doctor)
              .where(eq(doctor.userId, userId));

            const doctorId = doctorData[0].id;

            // Step 1: Fetch existing tags from the DB
            const existingTags = await db
              .select({
                tag: dbMetaTags.tag,
              })
              .from(dbMetaTags)
              .where(eq(dbMetaTags.doctorId, doctorId));

            const existingTagValues = existingTags.map((entry) => entry.tag);

            // Step 2: Determine tags to add and delete
            const tagsToAdd = metaTagsArray.filter(
              (tag) => !existingTagValues.includes(tag)
            );
            const tagsToDelete = existingTagValues.filter(
              (tag) => !metaTagsArray.includes(tag)
            );

            // Step 3: Insert new tags
            if (tagsToAdd.length > 0) {
              await db.insert(dbMetaTags).values(
                tagsToAdd.map((tag) => ({
                  doctorId,
                  tag,
                }))
              );
            }

            // Step 4: Delete removed tags
            if (tagsToDelete.length > 0) {
              await db
                .delete(dbMetaTags)
                .where(
                  and(
                    eq(dbMetaTags.doctorId, doctorId),
                    inArray(dbMetaTags.tag, tagsToDelete)
                  )
                );
            }
          }
          resolve(NextResponse.json({ success: true, fields, files }));
        } catch (error) {
          console.error("Database operation error:", error);
          resolve(NextResponse.json({ error: "Database operation failed" }, { status: 500 }));
        }
      });
    });

    return response;
  } catch (error) {
    console.error("Unexpected error in POST handler:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}