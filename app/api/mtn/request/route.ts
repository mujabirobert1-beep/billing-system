import { NextResponse } from "next/server";
import { requestMobileMoneyPayment } from "../../../lib/mtn";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload) {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const { phone, amount, reference } = payload;
  if (!phone || !amount || !reference) {
    return NextResponse.json({ error: "phone, amount, and reference are required." }, { status: 400 });
  }

  try {
    const result = await requestMobileMoneyPayment(String(phone).replace(/\D/g, ""), Number(amount), "UGX", String(reference));
    return NextResponse.json({ status: "pending", result });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
