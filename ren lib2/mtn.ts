const collectionUrl = process.env.MTN_COLLECTION_URL;
const apiKey = process.env.MTN_COLLECTION_API_KEY;
const subscriptionKey = process.env.MTN_COLLECTION_SUBSCRIPTION_KEY;
const targetEnvironment = process.env.MTN_COLLECTION_ENVIRONMENT ?? "sandbox";
const callbackUrl = process.env.MTN_COLLECTION_CALLBACK_URL;

export async function requestMobileMoneyPayment(
  phone: string,
  amount: number,
  currency = "UGX",
  reference: string
) {
  if (!collectionUrl || !apiKey || !subscriptionKey || !callbackUrl) {
    throw new Error("MTN Collection API credentials are not configured.");
  }

  const payload = {
    amount: String(amount),
    currency,
    externalId: reference,
    payer: {
      partyIdType: "MSISDN",
      partyId: phone,
    },
    payerMessage: "CloudiFi hotspot voucher payment",
    payeeNote: "CloudiFi voucher request",
    callbackUrl,
  };

  const response = await fetch(`${collectionUrl}/requesttopay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "Ocp-Apim-Subscription-Key": subscriptionKey,
      "X-Target-Environment": targetEnvironment,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`MTN request-to-pay failed: ${response.status} ${errorBody}`);
  }

  return response.json();
}
