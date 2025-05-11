import { applySession } from "@/app/api/session";
import http from "@/lib/http.service";
import { createEdgeRouter } from "next-connect";
import { RequestContext } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

const edgeRouter = createEdgeRouter<NextRequest, RequestContext>();

edgeRouter.use(applySession).post(async (req, res) => {
  const { username, password } = await req.json();

  try {
    // Send request to external API for authentication
    const response = await http.post("/auth/login", {
      username,
      password,
    });

    const { accessToken } = await response.data;

    // Store token in session
    req.session.token = accessToken;

    await new Promise((resolve) => req.session.save(resolve));
    console.log("req: **", req);

    const res = NextResponse.json({ message: "Login successful" });

    res.cookies.set("connect.sid", req.sessionID, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60,
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { message: "Error during login" },
      { status: 500 }
    );
  }
});

export async function POST(request: NextRequest, ctx: RequestContext) {
  return edgeRouter.run(request, ctx);
}
