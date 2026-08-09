const smsApiKey = process.env.SMS_PROVIDER_API_KEY;
const smsUrl = process.env.SMS_PROVIDER_URL;
const smsFrom = process.env.SMS_PROVIDER_FROM ?? "CloudiFi";
const emailApiKey = process.env.EMAIL_API_KEY;
const emailUrl = process.env.EMAIL_API_URL;

export async function sendSms(to: string, message: string) {
  if (!smsApiKey || !smsUrl) {
    console.warn("SMS not configured.");
    return;
  }

  await fetch(smsUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${smsApiKey}`,
    },
    body: JSON.stringify({ from: smsFrom, to, message }),
  });
}

export async function sendEmail(to: string, subject: string, body: string) {
  if (!emailApiKey || !emailUrl) {
    console.warn("Email not configured.");
    return;
  }

  await fetch(emailUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${emailApiKey}`,
    },
    body: JSON.stringify({ to, subject, body }),
  });
}
