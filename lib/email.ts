const emailApiKey = process.env.EMAIL_API_KEY;
const emailUrl = process.env.EMAIL_API_URL;

export async function sendEmail(to: string, subject: string, body: string) {
  if (!emailApiKey || !emailUrl) {
    console.warn("Email provider not configured.");
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
