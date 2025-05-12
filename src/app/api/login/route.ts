export const runtime = "nodejs";

import { applySession } from "@/app/api/session";
import http from "@/lib/http.service";
import { createEdgeRouter } from "next-connect";
import { NextResponse } from "next/server";
import { redisClient } from "@/app/api/redis";
import { CustomNextRequest } from "@/app/types/types";
import { RequestContext } from "next/dist/server/base-server";

const edgeRouter = createEdgeRouter<CustomNextRequest, RequestContext>();

edgeRouter.use(applySession).post(async (req) => {
  const { username, password } = await req.json();

  try {
    const response = await http.post("/auth/login", {
      username,
      password,
    });

    const { accessToken } = response.data;

    req.session.token = accessToken;
    await req.session.save();

    console.log("SessionID:", req.sessionID);

    const redisRaw = await redisClient.get(`sess:${req.sessionID}`);
    console.log("Session data in Redis:", redisRaw ?? "No session found");

    const loginResponse = NextResponse.json({ message: "Login successful" });

    loginResponse.cookies.set("connect.sid", req.sessionID, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day in seconds
    });

    return loginResponse;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Error during login" },
      { status: 500 }
    );
  }
});

export async function POST(request: CustomNextRequest, ctx: RequestContext) {
  return edgeRouter.run(request, ctx) as Promise<NextResponse>;
}
