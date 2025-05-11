const Redis = require("ioredis");

export const redisClient = new Redis(process.env.REDIS_URL);
redisClient.on("error", (err: any) => {
  console.error("Redis Client Error:", err);
});
