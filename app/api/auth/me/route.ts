/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserById } from "@/data/user";
import { withAuth } from "@/lib/jwtAccessProtected";
import { NextRequest, NextResponse } from "next/server";

const authMe = async (req: NextRequest & { user: any }) => {
  const userId = (await req.user).id;

  const existingUser = await getUserById(userId);

  const { password, ...user } = existingUser || {};

  return NextResponse.json({ data: user }, { status: 200 });
};

export const GET = withAuth(authMe);
