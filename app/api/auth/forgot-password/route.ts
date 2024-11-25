import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ForgotPasswordSchema } from "@/schemas";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const validation = ForgotPasswordSchema.parse(body);
    const { email } = validation;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return NextResponse.json(
        { message: "Email does not exist" },
        { status: 400 }
      );
    }
    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(email, passwordResetToken.token);

    return NextResponse.json({ message: "Reset email sent!" }, { status: 200 });
  } catch (error) {
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
