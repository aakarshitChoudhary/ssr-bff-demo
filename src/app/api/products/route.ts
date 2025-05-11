export const runtime = "nodejs";

import { createEdgeRouter } from "next-connect";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { applySession } from "../session";
import http from "@/lib/http.service";
import { redisClient } from "@/app/api/redis";
import { cookies } from "next/headers";
import { RequestContext } from "next/dist/server/base-server";

const router = createEdgeRouter<NextRequest, RequestContext>();

// Apply session middleware
router.use(applySession);

router.get(async (req) => {
  try {
    // Check session exists and token is valid
    const cookieStore = await cookies();

    // Get the value of a specific cookie
    const sessionId = cookieStore.get("connect.sid")?.value;
    console.log("sessionID: ", sessionId);

    // (Optional) log session content from Redis for debug
    const redisRaw = await redisClient.get(`sess:${sessionId}`);
    console.log("Session data in Redis:", redisRaw);

    // If no session data exists, return an error
    if (!redisRaw) {
      return NextResponse.json(
        { error: "Session not found or expired" },
        { status: 400 }
      );
    }

    // Parse the session data
    const sessionData = JSON.parse(redisRaw);
    console.log("TkoParsed session data:", sessionData);
    const accessToken = sessionData.token;

    // now do whatever with the accessToken

    // Make authenticated request to your product service
    const { data } = await http.get("/products");

    return NextResponse.json(data);
  } catch (err) {
    console.error("Products route error:", err);
    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 }
    );
  }
});

// Export for App Router API
export async function GET(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}
