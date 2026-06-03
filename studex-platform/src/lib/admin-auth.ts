// Minimal admin gate for the CRM. Single shared token in env (`ADMIN_TOKEN`),
// stored as an httpOnly cookie after login. Good enough to keep the admin
// surface off the public internet; replace with Supabase Auth later if needed.

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "studex_admin";

export async function isAdmin(): Promise<boolean> {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;
  const jar = await cookies();
  return jar.get(COOKIE_NAME)?.value === expected;
}

export async function setAdminCookie(token: string) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || token !== expected) return false;
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  });
  return true;
}

export async function clearAdminCookie() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

// API-route guard: 401 if not authenticated.
export async function requireAdmin(_req: NextRequest): Promise<NextResponse | null> {
  return (await isAdmin()) ? null : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
