import { NextResponse } from "next/server";
import { verifyAuthToken } from "../../../../../lib/verify";
import db from "../../../../../../db/db";
import { doctor, users } from "../../../../../../db/schema";
import { eq } from "drizzle-orm";

interface Params {
  doctor: string;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<Params> }
) {
  // 1. Verify user token
  const decodedOrResponse = await verifyAuthToken();
  if (decodedOrResponse instanceof NextResponse) return decodedOrResponse;

  const decoded = decodedOrResponse;
  const userId = Number(decoded.userId);

  // 2. Get user role
  const user = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user.length) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const userRole = user[0].role;

  // 3. Check if user is admin
  if (userRole !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // 4. Validate doctorId param
  const { doctor: doctorId } = await params;

  if (!doctorId) {
    return NextResponse.json({ error: "Missing doctorId" }, { status: 400 });
  }

  try {
    // 5. Fetch current doctor
    const current = await db
      .select()
      .from(doctor)
      .where(eq(doctor.id, Number(doctorId)))
      .limit(1);

    if (current.length === 0) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // 6. Toggle accountVerified status
    const currentVerified = current[0].accountVerified;

    await db
      .update(doctor)
      .set({ accountVerified: !currentVerified })
      .where(eq(doctor.id, Number(doctorId)));

    // 7. Return updated status
    return NextResponse.json({ accountVerified: !currentVerified });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
