import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";
import bcrypt from "bcryptjs";

import { LoginSchema } from "@/schemas";
import { getToken } from "@/lib/session";
import { getUserByEmail } from "@/data/user";
import {
  genearteVerificationToken,
  generateTwoFactorToken,
} from "@/lib/tokens";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import {
  getTwoFactorTokenByEmail,
  removeTwoFactorToken,
} from "@/data/two-factor-token";
import {
  addTwoFactorConfirmation,
  getTwoFactorConfirmationByUserId,
  removeTwoFactorConfirmation,
} from "@/data/two-factor-confirmation";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const validation = LoginSchema.parse(body);
    const { email, password, code } = validation;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.password) {
      return NextResponse.json({ error: "No User found" }, { status: 404 });
    }

    const validatePassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!validatePassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (!existingUser.emailVerified) {
      const verificationToken = await genearteVerificationToken(email);
      await sendVerificationEmail(existingUser.email, verificationToken.token);
      return NextResponse.json(
        { message: "Confirmation email sent!" },
        { status: 200 }
      );
    }

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
      if (!code) {
        const twoFactorToken = await generateTwoFactorToken(existingUser.email);
        await sendTwoFactorTokenEmail(
          twoFactorToken.email,
          twoFactorToken.token
        );

        return NextResponse.json(
          { message: "Two factor token sent!", twoFactor: true },
          { status: 200 }
        );
      }

      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) {
        return NextResponse.json({ message: "Invalid code!" }, { status: 400 });
      }

      if (twoFactorToken.token !== code) {
        return NextResponse.json({ message: "Invalid code!" }, { status: 400 });
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) {
        return NextResponse.json({ message: "Code expired!" }, { status: 400 });
      }

      await removeTwoFactorToken(twoFactorToken.id);

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await removeTwoFactorConfirmation(existingConfirmation.id);
      }

      await addTwoFactorConfirmation(existingUser.id);
    }

    const token = await getToken({ id: existingUser.id });

    return Response.json({
      data: {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        expiresIn: token.expiresIn,
      },
    });
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
