export function generateVoucherCode(length = 12) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export function voucherExpiresAt(days = 7) {
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  return expires;
}
