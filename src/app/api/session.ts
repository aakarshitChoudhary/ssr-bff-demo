import session from "express-session";
import { NextHandler } from "next-connect";

const sessionMiddleware = session({
  secret: "SESSION_SECRET",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: "lax",
  },
});

export const applySession = (
  req: any,
  res: any,
  next: NextHandler
): Promise<void> => {
  return new Promise((resolve, reject) => {
    sessionMiddleware(req, res, (err: any) => {
      if (err) return reject(err);
      resolve(next());
    });
  });
};
