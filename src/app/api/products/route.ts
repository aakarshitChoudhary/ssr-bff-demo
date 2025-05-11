import { createEdgeRouter } from "next-connect";
import type { NextRequest, NextFetchEvent } from "next/server";
import { NextResponse } from "next/server";
import { applySession } from "../session";
import http from "@/lib/http.service";
import { cookies } from "next/headers";

const router = createEdgeRouter<NextRequest, NextFetchEvent>();

// Apply session middleware
router.use(applySession);

router.get(async (req) => {
  const cookieStore = await cookies();

  // Get the value of a specific cookie
  const sessionId = cookieStore.get("connect.sid")?.value;

  if (!sessionId) {
    return NextResponse.json(
      { error: "Session cookie missing" },
      { status: 400 }
    );
  }
  console.log("Req: ", req);
  const sessionData = req.sessionStore;
  console.log("sessionData: ", sessionData);
  // form the req.sessionStore  object created by express session will
  // extract the saved session and token out from it.

  const { data } = await http.get("/products");

  return NextResponse.json(data);
});

export async function GET(request: NextRequest, event: NextFetchEvent) {
  return router.run(request, event);
}
