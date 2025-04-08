import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { IncomingForm } from "formidable";
import { Readable } from "stream";
import jwt from "jsonwebtoken";

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
  const doctorIdFromUrl = req.nextUrl.pathname.split("/").pop() || "unknown";
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
  console.log("Decoded JWT:", decoded);

  if (String(decoded.userId) !== doctorIdFromUrl) {
    // Optional: match doctor ID
    return NextResponse.json(
      { error: "Forbidden: Token-user mismatch" },
      { status: 403 }
    );
  }

  console.log("paste, the data like name email and phone number below");
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
      console.log("Email:", fields.email);
      console.log("Files:", files);

      // resolve(NextResponse.json({ success: true, fields, files }));
    });
  });
}
