import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { sendEmail, sendSms } from "../../../../lib/notifier";

const WARNING_SECONDS = 60;
const OFFLINE_SECONDS = 90;

function deriveStatus(lastSeen: Date | null) {
  if (!lastSeen) return "offline";
  const diff = Date.now() - lastSeen.getTime();
  if (diff > OFFLINE_SECONDS * 1000) return "offline";
  if (diff > WARNING_SECONDS * 1000) return "warning";
  return "online";
}

export async function POST() {
  const routers = await prisma.router.findMany({
    where: {},
    include: { site: { include: { reseller: true } } },
  });

  const now = new Date();
  const alerts: Array<{ routerId: string; status: string; reseller: { email: string; phone: string }; message: string }> = [];

  for (const router of routers) {
    const derived = deriveStatus(router.lastSeen);
    if (router.status !== derived) {
      await prisma.router.update({
        where: { id: router.id },
        data: { status: derived, lastCheckedAt: now },
      });
    }

    const shouldAlert = derived !== "online" && (!router.lastAlertSentAt || now.getTime() - router.lastAlertSentAt.getTime() > 5 * 60 * 1000);
    if (shouldAlert) {
      const message = `CloudiFi alert: ${router.site.name} - ${router.name} is ${derived.toUpperCase()}.`;
      alerts.push({ routerId: router.id, status: derived, reseller: { email: router.site.reseller.email, phone: router.site.reseller.phone }, message });
      await prisma.router.update({
        where: { id: router.id },
        data: { lastAlertSentAt: now },
      });
    }
  }

  for (const alert of alerts) {
    await Promise.all([
      sendEmail(alert.reseller.email, `CloudiFi router ${alert.status.toUpperCase()} alert`, alert.message),
      sendSms(alert.reseller.phone, alert.message),
    ]).catch((error) => {
      console.error("Alert send failed", error);
    });
  }

  return NextResponse.json({ message: "Router health check complete.", alerts: alerts.length });
}
