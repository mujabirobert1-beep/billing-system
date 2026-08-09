import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload) {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const { identity, status, siteId, name, ip, cpu, ram, uptime } = payload;
  if (!identity || !status || !siteId) {
    return NextResponse.json({ error: "identity, status, and siteId are required." }, { status: 400 });
  }

  const now = new Date();
  const normalizedStatus = String(status).toLowerCase();

  const router = await prisma.router.upsert({
    where: { identity },
    update: {
      name: name ?? identity,
      ip: ip ?? undefined,
      status: normalizedStatus,
      lastSeen: now,
      cpu: cpu ? Number(cpu) : undefined,
      ram: ram ? Number(ram) : undefined,
      uptime: uptime ? Number(uptime) : undefined,
      lastCheckedAt: now,
      site: { connect: { id: siteId } },
    },
    create: {
      identity,
      name: name ?? identity,
      ip: ip ?? undefined,
      status: normalizedStatus,
      lastSeen: now,
      cpu: cpu ? Number(cpu) : undefined,
      ram: ram ? Number(ram) : undefined,
      uptime: uptime ? Number(uptime) : undefined,
      lastCheckedAt: now,
      site: { connect: { id: siteId } },
    },
  });

  return NextResponse.json({ message: "Heartbeat received.", router });
}
