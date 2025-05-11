export const runtime = "nodejs";

import { applySession } from "@/app/api/session";
import http from "@/lib/http.service";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";
import { redisClient } from "@/app/api/redis";

// Setup router with types
const edgeRouter = createEdgeRouter<NextRequest>();

// Apply session and handle POST login
edgeRouter.use(applySession).post(async (req, res) => {
  const { username, password } = await req.json();

  try {
    // Authenticate user via external service
    const response = await http.post("/auth/login", {
      username,
      password,
    });

    const { accessToken } = response.data;

    // Save token in session
    req.session.token = accessToken;
    req.session.save();

    console.log("SessionID:", req.sessionID);

    // Check what's stored in Redis
    const redisRaw = await redisClient.get(`sess:${req.sessionID}`);
    console.log("Session data in Redis:", redisRaw);

    // Create response and attach session ID cookie
    const res = NextResponse.json({ message: "Login successful" });

    res.cookies.set("connect.sid", req.sessionID, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60, // 1 day
    });

    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Error during login" },
      { status: 500 }
    );
  }
});

// Export route handler
export async function POST(request: NextRequest, ctx: RequestContext) {
  return edgeRouter.run(request, ctx);
}
