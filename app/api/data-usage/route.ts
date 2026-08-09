import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload) {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const { customer_name, phone, voucher_code, router_id, bytes_up, bytes_down, session_start, session_end } = payload;
  if (!customer_name || !phone || !voucher_code || !router_id || !bytes_up || !bytes_down || !session_start || !session_end) {
    return NextResponse.json({ error: "Missing required data usage fields." }, { status: 400 });
  }

  try {
    const usage = await prisma.dataUsage.create({
      data: {
        customerName: String(customer_name),
        phone: String(phone),
        voucherCode: String(voucher_code),
        router: { connect: { id: String(router_id) } },
        bytesUp: Number(bytes_up),
        bytesDown: Number(bytes_down),
        sessionStart: new Date(String(session_start)),
        sessionEnd: new Date(String(session_end)),
      },
    });

    return NextResponse.json({ message: "Data usage recorded.", usage });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
