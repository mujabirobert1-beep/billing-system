import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { generateVoucherCode, voucherExpiresAt } from "../../../../lib/voucher";
import { sendSms } from "../../../../lib/sms";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload) {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const { status, externalId, amount, currency, payer } = payload;
  const reference = externalId ?? payload.transactionId ?? null;

  if (!reference || !payer?.partyId) {
    return NextResponse.json({ error: "Missing callback reference or payer phone." }, { status: 400 });
  }

  const normalizedPhone = String(payer.partyId).replace(/\D/g, "");
  const username = normalizedPhone;

  const user = await prisma.user.upsert({
    where: { phone: normalizedPhone },
    update: { username },
    create: { phone: normalizedPhone, username },
  });

  const paymentData = {
    reference,
    amount: amount ? Number(amount) : 0,
    currency: currency ?? "UGX",
    phone: normalizedPhone,
    status: String(status),
    user: { connect: { id: user.id } },
  };

  const payment = await prisma.payment.upsert({
    where: { reference },
    update: paymentData,
    create: paymentData,
  });

  if (String(status).toLowerCase() !== "paid") {
    return NextResponse.json({ message: "Payment callback received but not paid.", payment }, { status: 202 });
  }

  const voucherCode = generateVoucherCode();
  const voucher = await prisma.voucher.create({
    data: {
      code: voucherCode,
      username,
      amount: Number(payment.amount),
      expiresAt: voucherExpiresAt(7),
      payment: { connect: { id: payment.id } },
    },
  });

  try {
    await import("../../../../lib/mikrotik").then(async ({ createHotspotUser }) => {
      await createHotspotUser(username, voucherCode);
    });
  } catch (error) {
    console.error("MikroTik creation failed", error);
  }

  const smsBody = `CloudiFi voucher: ${voucherCode}. Username: ${username}. Password: ${voucherCode}. Expires ${voucher.expiresAt.toISOString().slice(0, 10)}.`;
  await sendSms(normalizedPhone, smsBody).catch((error) => {
    console.error("SMS send failed", error);
  });

  return NextResponse.json({ message: "Voucher created, MikroTik user created, and SMS sent.", voucher });
}
