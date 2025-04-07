// middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, type JWTPayload } from 'jose';

interface JWTPayloadWithRole extends JWTPayload {
  userId: string;
  role: 'admin' | 'doctor' | 'patient';
}

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_ROUTES = ['/admin/dashboard'];
const DOCTOR_ONLY_ROUTES = ['/admin/dashboard/user', '/admin/dashboard/subscription'];
const PATIENT_ONLY_ROUTES = ['/admin/dashboard/patient'];

// Use Web Crypto API (compatible with Edge)
function getKey() {
  if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined');
  return new TextEncoder().encode(JWT_SECRET);
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname.replace(/\/$/, '');
  const token = req.cookies.get('authToken')?.value;
  console.log('Middleware running on:', req.nextUrl.pathname);

  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not defined');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (!token) {
    console.log('No token, redirecting to login.');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const { payload } = await jwtVerify(token, getKey());
    const { role } = payload as JWTPayloadWithRole;

    const isAdminRoute = ADMIN_ROUTES.includes(pathname);
    const isDoctorRoute = DOCTOR_ONLY_ROUTES.includes(pathname);
    const isPatientRoute = PATIENT_ONLY_ROUTES.includes(pathname);

    if (
      (isAdminRoute && role !== 'admin') ||
      (isDoctorRoute && role !== 'doctor') ||
      (isPatientRoute && role !== 'patient')
    ) {
      console.warn(`Access denied for ${role} on ${pathname}`);
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: [
    '/admin/dashboard',
    '/admin/dashboard/user',
    '/admin/dashboard/subscription',
    '/admin/dashboard/patient',
  ],
};
