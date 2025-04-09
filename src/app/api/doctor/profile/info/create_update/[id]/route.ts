import fs from "fs";
import path from "path";
import { extname } from "path";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { IncomingForm } from "formidable";
import { Readable } from "stream";
import jwt from "jsonwebtoken";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";

import { doctor } from "../../../../../../../db/schema";
import { LuLinkedin } from "react-icons/lu";

export const config = {
  api: {
    bodyParser: false,
  },
};

function createNodeRequest(req: NextRequest): Promise<any> {
  return new Promise(async (resolve) => {
    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);

    // Build a mock IncomingMessage
    const nodeReq: any = readable;
    nodeReq.headers = Object.fromEntries(req.headers.entries());
    nodeReq.method = req.method;

    resolve(nodeReq);
  });
}

export async function POST(req: NextRequest) {
  const userIdFromUrl = req.nextUrl.pathname.split("/").pop() || "unknown";
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: No token" },
      { status: 401 }
    );
  }

  // Verify JWT
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: string;
    role: string;
  };

  const userId = Number(decoded.userId);

  if (String(userId) != userIdFromUrl) {
    // Optional: match doctor ID
    return NextResponse.json(
      { error: "Forbidden: Token-user mismatch" },
      { status: 403 }
    );
  }

  const nodeReq = await createNodeRequest(req);

  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ multiples: false });

    form.parse(nodeReq, async (err, fields, files) => {
      if (err) {
        console.error("Form parse error:", err);
        return reject(
          NextResponse.json({ error: "Form parse error" }, { status: 500 })
        );
      }

      console.log("Name:", fields.name);

      const connectionString = process.env.DATABASE_URL;
      if (!connectionString) {
        throw new Error("DATABASE_URL is not set in environment variables.");
      }

      const sql = postgres(connectionString, { max: 1 });
      const db = drizzle(sql);
      const ExistingDoctor = await db
        .select()
        .from(doctor)
        .where(eq(doctor.userId, Number(decoded.userId)));
      // console.log("ExistingDoctor:", ExistingDoctor);

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
        // seo_description
      } = fields;

      const baseUploadPath = path.join(process.cwd(), "private_uploads");
      const pictureFile = Array.isArray(files.profileImage)
        ? files.profileImage[0]
        : files.profileImage;
      const signatureFile = Array.isArray(files.signatureImage)
        ? files.signatureImage[0]
        : files.signatureImage;

      let pictureLink = null;
      let signatureLink = null;

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
        console.log(signatureLink);
      }
      const experienceValue = Array.isArray(experience)
        ? experience[0]
        : experience;

      // Build update/insert object based on received fields
      const updateValues: Record<string, any> = {};
      if (name) updateValues.name = name;
      if (email) updateValues.email = email;
      if (phone) updateValues.phone = phone;
      if (city) updateValues.city = city;
      if (specialization) updateValues.specialization = specialization;
      if (degree) updateValues.degree = degree;

      if (experienceValue !== undefined && experienceValue !== "") {
        updateValues.experience = Number(experienceValue);
      }

      if (aboutSelf) updateValues.aboutSelf = aboutSelf;
      if (aboutClinic) updateValues.aboutClinic = aboutClinic;
      if (pictureLink) updateValues.image_link = pictureLink;
      if (signatureLink) updateValues.signature_link = signatureLink;
      
      if (linkedin) updateValues.linkedin_link = linkedin;
      if (facebook) updateValues.facebook_link = facebook;
      if (instagram) updateValues.instagram_link= instagram;
      if (twitter) updateValues.twitter_link = twitter;
      // if (true) updateValues.seo_description = true

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
      resolve(NextResponse.json({ success: true, fields, files }));
    });
  });
}

// uploadDirPicture: = "/private_uploads/profiles/<userid>_picture.<extension>"
// uploadDirSignature = "/private_uploads/signatures/<userid>_signature.<extension>"
// const pictureLink =
// "/api/doctor/profile/info/images/<userid>/<userid>_picture.<extension>";
// const signatureLink =
// "/api/doctor/profile/info/images/<userid>/<userid>_signature.<extension>";
