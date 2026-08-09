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

  const { name, email, phone } = payload;
  if (!name || !email || !phone) {
    return NextResponse.json({ error: "name, email, and phone are required." }, { status: 400 });
  }

  const verificationCode = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  const customer = await prisma.customer.upsert({
    where: { email: String(email).toLowerCase() },
    update: {
      name: String(name),
      phone: String(phone),
      verificationCode,
      verificationCodeExpiresAt: expiresAt,
      emailVerified: false,
    },
    create: {
      name: String(name),
      email: String(email).toLowerCase(),
      phone: String(phone),
      verificationCode,
      verificationCodeExpiresAt: expiresAt,
      emailVerified: false,
    },
  });

  const emailBody = `Your CloudiFi verification code is ${verificationCode}. It expires in 15 minutes.`;
  await sendEmail(customer.email, "CloudiFi verification code", emailBody).catch((error) => {
    console.error("Email send failed", error);
  });

  return NextResponse.json({ message: "Verification code sent to email." });
}
