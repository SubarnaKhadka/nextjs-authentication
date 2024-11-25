/* eslint-disable @typescript-eslint/no-explicit-any */
import { withRefreshAuth } from "@/lib/jwtRefreshProtected";
import { NextRequest, NextResponse } from "next/server";

const RefreshJwt = async (req: NextRequest & { user: any }) => {
  // TODO: ADD REFRESH TOKEN LOGIC
  const refreshExpiresIn = req.user.expires;
  
  return NextResponse.json({ message: "refresh" });
};

export const POST = withRefreshAuth(RefreshJwt);
