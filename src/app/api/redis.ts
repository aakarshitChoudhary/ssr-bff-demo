import { createClient, RedisClientType } from "redis";

let client: RedisClientType | null = null;

export function getRedisClient(): RedisClientType {
  if (!client) {
    client = createClient({ url: process.env.REDIS_URL });
    client.on("error", (err) => console.error("Redis Error:", err));
    client.connect().catch((err) => console.error("Redis Connect Error:", err));
  }
  return client;
}
