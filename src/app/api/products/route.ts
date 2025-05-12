// app/api/products/route.ts
import { NextResponse } from "next/server";
import http from "@/lib/http.service";
import { getSession } from "../session";

export async function GET() {
  // 1. Load session
  const session = await getSession();
  console.log("session: ", session);

  if (!session?.token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // 2. Extract token
  const accessToken = session.token;
  console.log("accessToken: ", accessToken);

  try {
    // 3. Call your products service with auth header
    const { data } = await http.get("/products");
    return NextResponse.json(data);
  } catch (err) {
    console.error("Products fetch error:", err);
    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 502 }
    );
  }
}
