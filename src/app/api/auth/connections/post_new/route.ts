// /src/app/api/auth/connections/post_new/route.ts
import { NextRequest, NextResponse } from "next/server";

// By default only POST is exported because that’s all we need
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    // Extract the parts you are interested in
    const content = form.get("content") as string | null;
    const socialMedia = JSON.parse(
      (form.get("socialMedia") as string | null) ?? "[]"
    ) as string[];
    const imageFile = form.get("image"); // Will be either `File` or `null`

    console.log("➜ NEW POST");
    console.log({ content, socialMedia, imageFile });

    // TODO: perform the actual “post now” logic here

    return NextResponse.json(
      { message: "Post dispatched successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error while processing post" },
      { status: 500 }
    );
  }
}
