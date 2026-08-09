import { NextResponse } from "next/server";
import { createHotspotUser } from "../../../../lib/mikrotik";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload) {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const { username, password, profile, comment } = payload;
  if (!username || !password) {
    return NextResponse.json({ error: "Missing required hotspot user fields." }, { status: 400 });
  }

  try {
    const response = await createHotspotUser(String(username), String(password), String(profile ?? "default"), String(comment ?? "CloudiFi voucher user"));
    return NextResponse.json({ message: "Hotspot user created.", response });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Failed to create hotspot user." }, { status: 500 });
  }
}
