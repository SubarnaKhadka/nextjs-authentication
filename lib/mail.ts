import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${appUrl}/auth/verify?token=${token}`;

  await resend.emails.send({
    from: "no-reply@resend.dev",
    to: email,
    subject: "Please confirm your account",
    html: `<p><a href="${confirmLink}">Click here</a> to confirm your account.</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${appUrl}/auth/reset-password?token=${token}`;

  await resend.emails.send({
    from: "no-reply@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `<p><a href="${resetLink}">Click here</a> to reset your password.</p>`,
  });
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "no-reply@resend.dev",
    to: email,
    subject: "Two factor token",
    html: `<p>Your two factor token is ${token}</p>`,
  });
};
