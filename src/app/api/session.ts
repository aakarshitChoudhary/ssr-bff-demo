import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { getRedisClient } from "./redis";

export interface SessionData {
  token?: string;
  createdAt: number; // Unix timestamp when session was created
  [key: string]: any; // any other custom fields
}

const COOKIE_NAME = "sessionId";
const REDIS_PREFIX = "session:";
const TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

/**
 * Create a new session:
 * 1. Generate a sessionId (randomUUID)
 * 2. Stamp createdAt
 * 3. Store in Redis under `session:<sessionId>` with EX = TTL
 * 4. Set HTTP-only cookie `sessionId`
 */
export async function createSession(
  data: Omit<SessionData, "createdAt">
): Promise<string> {
  const sessionId = randomUUID();
  const session: SessionData = {
    ...data,
    createdAt: Math.floor(Date.now() / 1000),
  };

  const client = getRedisClient();
  await client.set(`${REDIS_PREFIX}${sessionId}`, JSON.stringify(session), {
    EX: TTL_SECONDS,
  });

  (await cookies()).set(COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TTL_SECONDS,
  });

  return sessionId;
}

/** Read session from cookie + Redis. Returns null if missing or expired. */
export async function getSession(): Promise<SessionData | null> {
  const store = await cookies();
  const sessionId = store.get(COOKIE_NAME)?.value;
  if (!sessionId) return null;

  const client = getRedisClient();
  const raw = await client.get(`${REDIS_PREFIX}${sessionId}`);
  return raw ? (JSON.parse(raw) as SessionData) : null;
}

/**
 * Destroy session:
 * 1. Read `sessionId` cookie
 * 2. Delete Redis key
 * 3. Clear cookie
 */
export async function destroySession(): Promise<boolean> {
  const store = await cookies();
  const sessionId = store.get(COOKIE_NAME)?.value;
  if (!sessionId) return false;

  const client = getRedisClient();
  await client.del(`${REDIS_PREFIX}${sessionId}`);
  store.delete(COOKIE_NAME);
  return true;
}
