import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { sendEmail } from "../../../../lib/notifier";

function generateVerificationCode() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload) {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const { email } = payload;
  if (!email) {
    return NextResponse.json({ error: "email is required." }, { status: 400 });
  }

  const customer = await prisma.customer.findUnique({ where: { email: String(email).toLowerCase() } });
  if (!customer) {
    return NextResponse.json({ error: "Customer not found." }, { status: 404 });
  }

  if (customer.emailVerified) {
    return NextResponse.json({ message: "Email is already verified." });
  }

  const verificationCode = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.customer.update({
    where: { id: customer.id },
    data: {
      verificationCode,
      verificationCodeExpiresAt: expiresAt,
    },
  });

  const emailBody = `Your CloudiFi verification code is ${verificationCode}. It expires in 15 minutes.`;
  await sendEmail(customer.email, "CloudiFi verification code", emailBody).catch((error) => {
    console.error("Email resend failed", error);
  });

  return NextResponse.json({ message: "Verification code resent to email." });
}
