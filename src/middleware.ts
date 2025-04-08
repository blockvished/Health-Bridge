import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, type JWTPayload } from "jose";

interface JWTPayloadWithRole extends JWTPayload {
  userId: string;
  role: "admin" | "doctor" | "patient";
}

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_ROUTES = ["/admin/dashboard"];
const DOCTOR_ONLY_ROUTES = [
  "/admin/dashboard/user",
  "/admin/subscription",
  "/admin/department",
  "/admin/appointment/assign",
  "/admin/live_consults/settings",
  "/admin/profile/qr_code",
  "/admin/payment/lists",
  "/admin/domain",
  "/admin/payouts/setup_account",
  "/admin/payouts/user",
  "/admin/posts/settings",
  "/admin/posts/report",
  "/admin/posts/all",
  "/admin/staff",
  "/admin/patients",
  "/admin/appointment",
  "/admin/appointment/all_list",
  "/admin/profile",
  "/admin/educations",
  "/admin/experiences",
  "/admin/prescription",
  "/admin/prescription/all_prescription",
  "/admin/dashboard/rating",
  "/admin/contact/user",
];
const PATIENT_ONLY_ROUTES = ["/admin/dashboard/patient"];

const DEFAULT_REDIRECT: Record<string, string> = {
  admin: "/admin/dashboard",
  doctor: "/admin/dashboard/user",
  patient: "/admin/dashboard/patient",
};

function getKey() {
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  return new TextEncoder().encode(JWT_SECRET);
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname.replace(/\/$/, "");
  const token = req.cookies.get("authToken")?.value;

  console.log("Middleware running on:", pathname);

  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!token) {
    // Allow unauthenticated users to access login/register
    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.next();
    }

    console.log("No token, redirecting to login.");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, getKey());
    const { role } = payload as JWTPayloadWithRole;

    const res = NextResponse.next();
    // Set role in cookies so the client can access it
    res.cookies.set("userRole", role, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    const isAdminRoute = ADMIN_ROUTES.includes(pathname);
    const isDoctorRoute = DOCTOR_ONLY_ROUTES.includes(pathname);
    const isPatientRoute = PATIENT_ONLY_ROUTES.includes(pathname);

    // If a logged-in user accesses login/register, redirect to default route
    if (pathname === "/login" || pathname === "/register") {
      const redirectTo = DEFAULT_REDIRECT[role];
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }

    if (
      (isAdminRoute && role !== "admin") ||
      (isDoctorRoute && role !== "doctor") ||
      (isPatientRoute && role !== "patient")
    ) {
      console.warn(`Access denied for ${role} on ${pathname}`);
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return res
  } catch (err) {
    console.error("JWT verification failed:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/register"],
};
