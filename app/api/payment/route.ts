import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { generateVoucherCode, voucherExpiresAt } from "../../../lib/voucher";
import { sendSms } from "../../../lib/sms";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload) {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const { reference, amount, currency, phone, status } = payload;
  if (!reference || !amount || !phone || !status) {
    return NextResponse.json({ error: "Missing required payment fields." }, { status: 400 });
  }

  const paymentExists = await prisma.payment.findUnique({ where: { reference } });
  if (paymentExists) {
    return NextResponse.json({ message: "Payment already processed.", payment: paymentExists });
  }

  const normalizedPhone = String(phone).replace(/\D/g, "");
  const username = normalizedPhone;

  const user = await prisma.user.upsert({
    where: { phone: normalizedPhone },
    update: { username },
    create: { phone: normalizedPhone, username },
  });

  const payment = await prisma.payment.create({
    data: {
      reference,
      amount: Number(amount),
      currency: String(currency ?? "USD"),
      phone: normalizedPhone,
      status: String(status),
      user: { connect: { id: user.id } },
    },
  });

  if (String(status).toLowerCase() !== "completed") {
    return NextResponse.json({ message: "Payment recorded. Waiting for completion." }, { status: 202 });
  }

  const voucherCode = generateVoucherCode();
  const voucher = await prisma.voucher.create({
    data: {
      code: voucherCode,
      username,
      amount: Number(amount),
      expiresAt: voucherExpiresAt(7),
      payment: { connect: { id: payment.id } },
    },
  });

  const smsBody = `CloudiFi voucher: ${voucherCode}. Username: ${username}. Expires ${voucher.expiresAt.toISOString().slice(0, 10)}.`;
  await sendSms(normalizedPhone, smsBody).catch((error) => {
    console.error("SMS send failed", error);
  });

  return NextResponse.json({ message: "Voucher created and SMS sent.", voucher });
}
