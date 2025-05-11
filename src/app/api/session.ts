import session from "express-session";
import { redisClient } from "./redis";
import { RedisStore } from "connect-redis";

// ✅ No need to import connectRedis or call it as a function
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "sess:",
});

const sessionMiddleware = session({
  store: redisStore,
  secret: "supersecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "lax",
  },
});

export const applySession = (req: any, res: any, next: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    sessionMiddleware(req, res, (err: any) => {
      if (err) return reject(err);
      resolve(next());
    });
  });
};
