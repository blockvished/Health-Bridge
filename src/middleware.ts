import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, type JWTPayload } from "jose";

interface JWTPayloadWithRole extends JWTPayload {
  userId: string;
  role: "admin" | "doctor" | "patient";
}

const JWT_SECRET = process.env.JWT_SECRET;

const ADMIN_ROUTES = [
  "/admin/dashboard",
  "/admin/dashboard",
  "/admin/settings",
  "/admin/payouts/settings",
  "/admin/payouts/add",
  "/admin/payouts/requests",
  "/admin/payouts/completed",
  "/admin/domain/request",
  "/admin/domain/settings",
  "/admin/package",
  "/admin/payment/transactions",
  "/admin/users",
  "/admin/contact",
];

const DOCTOR_ONLY_ROUTES = [
  "/doctor/dashboard/",
  "/doctor/subscription",
  "/doctor/settings/department",
  "/doctor/settings/set-schedule",
  "/doctor/settings/live_consults",
  "/doctor/settings/qr_code",
  "/doctor/payments",
  "/doctor/domain",
  "/doctor/payouts/set_account",
  "/doctor/payouts/user",
  "/doctor/posts/settings",
  "/doctor/posts/report",
  "/doctor/posts/all",
  "/doctor/staff",
  "/doctor/patients",
  "/doctor/appointment",
  "/doctor/appointment/all_list",
  "/doctor/profile",
  "/doctor/educations",
  "/doctor/experiences",
  "/doctor/prescription",
  "/doctor/prescription/all_prescription",
  "/doctor/rating",
  "/doctor/contact/user",
];
const PATIENT_ONLY_ROUTES = [
  "/patient/dashboard",
  "/admin/patient/doctors",
  "/admin/patient/appointments",
  "/admin/patient/prescriptions",
];

const DEFAULT_REDIRECT: Record<string, string> = {
  admin: "/admin/dashboard",
  doctor: "/doctor/dashboard",
  patient: "/patient/dashboard",
};

function getKey() {
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  return new TextEncoder().encode(JWT_SECRET);
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname.replace(/\/$/, "");
  
  console.log({
    path: pathname,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });
  
  const token = req.cookies.get("authToken")?.value;

  console.log("Middleware running on:", pathname);


  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined");
    return NextResponse.redirect(new URL("/register", req.url));
  }

  if (!token) {
    // Allow unauthenticated users to access login/register
    if (pathname === "/" || pathname === "/register") {
      return NextResponse.next();
    }

    console.log("No token, redirecting to login.");
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, getKey());
    const { userId, role } = payload as JWTPayloadWithRole;

    const res = NextResponse.next();
    // Set role in cookies so the client can access it
    res.cookies.set("userRole", role, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    res.cookies.set("userId", userId.toString(), {
      // Ensure userId is a string
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60, // 1 hour (you can adjust this as needed)
    });

    const isAdminRoute = ADMIN_ROUTES.includes(pathname);
    const isDoctorRoute = DOCTOR_ONLY_ROUTES.includes(pathname);
    const isPatientRoute = PATIENT_ONLY_ROUTES.includes(pathname);

    // If a logged-in user accesses login/register, redirect to default route
    if (pathname === "/register") {
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

    return res;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return NextResponse.redirect(new URL("/register", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/register"],
};
