import { NextRequest, NextResponse } from "next/server";
import { decryptAccessToken } from "./session";

export const withAuth = (handler: Function) => {
  return async (req: NextRequest & { user: any }, ...args: any[]) => {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = await decryptAccessToken(token);

      if (!decoded) {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
      }

      req.user = decoded;

      return handler(req, ...args);
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
  };
};
