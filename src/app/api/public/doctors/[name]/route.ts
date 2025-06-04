import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const decodedName = decodeURIComponent(params.slug).replace(/-/g, " ");
  console.log("Doctor name from URL:", decodedName);

  return NextResponse.json({
    message: `Received name: ${decodedName}`,
  });
}
