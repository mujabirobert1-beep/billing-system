const smsApiKey = process.env.SMS_PROVIDER_API_KEY;
const smsFrom = process.env.SMS_PROVIDER_FROM ?? "CloudiFi";
const smsUrl = process.env.SMS_PROVIDER_URL ?? "https://api.smsprovider.example/send";

export async function sendSms(to: string, message: string) {
  if (!smsApiKey) {
    console.warn("SMS API key is not configured. SMS not sent.", { to, message });
    return;
  }

  const payload = {
    from: smsFrom,
    to,
    message,
  };

  await fetch(smsUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${smsApiKey}`,
    },
    body: JSON.stringify(payload),
  });
}
