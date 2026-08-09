import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload) {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const { email, verificationCode } = payload;
  if (!email || !verificationCode) {
    return NextResponse.json({ error: "email and verificationCode are required." }, { status: 400 });
  }

  const customer = await prisma.customer.findUnique({ where: { email: String(email).toLowerCase() } });
  if (!customer) {
    return NextResponse.json({ error: "Customer not found." }, { status: 404 });
  }

  if (customer.emailVerified) {
    return NextResponse.json({ message: "Email already verified." });
  }

  if (customer.verificationCode !== String(verificationCode)) {
    return NextResponse.json({ error: "Invalid verification code." }, { status: 400 });
  }

  if (!customer.verificationCodeExpiresAt || customer.verificationCodeExpiresAt < new Date()) {
    return NextResponse.json({ error: "Verification code expired." }, { status: 400 });
  }

  await prisma.customer.update({
    where: { id: customer.id },
    data: {
      emailVerified: true,
      verificationCode: null,
      verificationCodeExpiresAt: null,
    },
  });

  return NextResponse.json({ message: "Email verified successfully." });
}
