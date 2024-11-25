import { getUserByEmail, updateEmailVerified } from "@/data/user";
import {
  getVerificationTokenByToken,
  removeVerificationToken,
} from "@/data/verification-token";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.token) {
    return NextResponse.json({ message: "missing token" }, { status: 400 });
  }
  const existingToken = await getVerificationTokenByToken(body.token);

  if (!existingToken) {
    return NextResponse.json(
      { message: "Token does not exist!" },
      { status: 400 }
    );
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return NextResponse.json(
      { message: "Email doesnot exist!" },
      { status: 400 }
    );
  }

  await updateEmailVerified(existingUser.id, new Date());
  await removeVerificationToken(existingToken.id);

  return Response.json({ message: "Email verified!" }, { status: 200 });
}
