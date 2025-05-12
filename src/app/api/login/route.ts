// app/api/login/route.ts
import { NextResponse } from "next/server";
import http from "@/lib/http.service";
import { createSession } from "@/app/api/session";
import { getRedisClient } from "@/app/api/redis";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // 1) authenticate via your backend
    const response = await http.post("/auth/login", { username, password });
    const { accessToken } = response.data;

    // 2) create + store session in Redis, set cookie
    const sessionId = await createSession({ token: accessToken });

    console.log("New SessionID:", sessionId);

    // 3) verify it’s really in Redis (optional)
    const client = getRedisClient();
    const redisRaw = await client.get(`session:${sessionId}`);
    console.log("Session data in Redis:", redisRaw);

    // 4) return success
    return NextResponse.json({ message: "Login successful" });
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json(
      { message: err?.message || "Login failed" },
      { status: 401 }
    );
  }
}
