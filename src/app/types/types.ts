import { NextRequest } from "next/server";
import { Session } from "express-session";

export interface CustomNextRequest extends NextRequest {
  session: Session & { [key: string]: any };
  sessionID: string;
}
