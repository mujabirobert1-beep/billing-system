import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

async function processHeartbeat(payload: Record<string, any>) {
  const identity = String(payload.id ?? payload.identity ?? "").trim();
  const siteId = payload.siteId ?? payload.site_id ?? payload.site;
  const status = String(payload.status ?? "online").toLowerCase();
  const name = payload.name ?? identity;
  const ip = payload.ip ?? payload.address ?? undefined;
  const cpu = payload.cpu ? Number(payload.cpu) : undefined;
  const ram = payload.ram ? Number(payload.ram) : undefined;
  const uptime = payload.uptime ? Number(payload.uptime) : undefined;
  const now = new Date();

  if (!identity) {
    return NextResponse.json({ error: "Router identity is required." }, { status: 400 });
  }

  const existing = await prisma.router.findUnique({ where: { identity } });
  if (!existing && !siteId) {
    return NextResponse.json({ error: "siteId is required for new routers." }, { status: 400 });
  }

  const upsertData = {
    name: name ?? identity,
    ip: ip ?? existing?.ip ?? undefined,
    status,
    lastSeen: now,
    cpu,
    ram,
    uptime,
    lastCheckedAt: now,
    site: siteId ? { connect: { id: siteId } } : undefined,
  } as any;

  const router = await prisma.router.upsert({
    where: { identity },
    update: upsertData,
    create: {
      identity,
      ...upsertData,
    },
  });

  return NextResponse.json({ message: "Heartbeat received.", router });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const payload: Record<string, string | undefined> = {};
  url.searchParams.forEach((value, key) => {
    payload[key] = value;
  });
  return processHeartbeat(payload);
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload) {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }
  return processHeartbeat(payload);
}
