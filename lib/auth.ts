import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Authenticate admin with email and password
 */
export async function authenticateAdmin(
  email: string,
  password: string
): Promise<{ success: boolean; admin?: { id: string; email: string; name: string } }> {
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    return { success: false };
  }

  const isValid = await verifyPassword(password, admin.password);

  if (!isValid) {
    return { success: false };
  }

  return {
    success: true,
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
    },
  };
}

/**
 * Create a session for the admin
 */
export async function createSession(adminId: string): Promise<void> {
  const cookieStore = await cookies();
  
  // Simple session: just store the admin ID (encrypted in production)
  // For production, use a proper session library or JWT
  const sessionData = Buffer.from(
    JSON.stringify({ adminId, createdAt: Date.now() })
  ).toString("base64");

  cookieStore.set(SESSION_COOKIE_NAME, sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

/**
 * Get the current admin session
 */
export async function getSession(): Promise<{ adminId: string } | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const sessionData = JSON.parse(
      Buffer.from(sessionCookie.value, "base64").toString()
    );

    // Check if session is expired
    if (Date.now() - sessionData.createdAt > SESSION_MAX_AGE * 1000) {
      return null;
    }

    return { adminId: sessionData.adminId };
  } catch {
    return null;
  }
}

/**
 * Get the current admin from session
 */
export async function getCurrentAdmin() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const admin = await prisma.admin.findUnique({
    where: { id: session.adminId },
    select: { id: true, email: true, name: true },
  });

  return admin;
}

/**
 * Destroy the current session (logout)
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Check if user is authenticated (for middleware)
 */
export async function isAuthenticated(): Promise<boolean> {
  const admin = await getCurrentAdmin();
  return admin !== null;
}
