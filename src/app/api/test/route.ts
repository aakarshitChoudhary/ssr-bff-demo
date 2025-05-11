import { createClient } from "redis";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = createClient({
      url: process.env.REDIS_URL,
    });

    client.on("error", (err) => console.error("Redis error:", err));

    await client.connect();
    await client.set("hello", "world");
    const value = await client.get("hello");

    await client.quit();

    return NextResponse.json({ message: "Connected!", value });
  } catch (err) {
    console.error("❌ Redis connection failed", err);
    return NextResponse.json(
      { error: "Connection failed", details: String(err) },
      { status: 500 }
    );
  }
}
