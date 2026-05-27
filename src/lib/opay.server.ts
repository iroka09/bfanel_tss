import crypto from "crypto";

export const OPAY_BASE_URL = process.env.OPAY_BASE_URL!;
export const MERCHANT_ID = process.env.OPAY_MERCHANT_ID!;
const PRIVATE_KEY = process.env.OPAY_PRIVATE_KEY!;
const PUBLIC_KEY = process.env.OPAY_PUBLIC_KEY!;

/** HMAC-SHA512 signature over the raw JSON body string */
export function signPayload(body: object): string {
  const json = JSON.stringify(body);
  return crypto.createHmac("sha512", PRIVATE_KEY).update(json).digest("hex");
}

/** Headers required on every Opay request */
export function opayHeaders(payload?: object) {
  return {
    "Content-Type": "application/json",
    MerchantId: MERCHANT_ID,
    Authorization: `Bearer ${body ? signPayload(payload) : PUBLIC_KEY}`, // signed payload is for querying payment status while PUBLIC_KEY is for creating new order
  };
}

/** Verify Opay sends the webhook to us (uses public key for webhook sig) */
export function verifyWebhookSignature(
  payload: object,
  receivedSig: string
): boolean {
  const expected = crypto
    .createHmac("sha512", PUBLIC_KEY)
    .update(JSON.stringify(payload))
    .digest("hex");
  return expected === receivedSig;
}

/** Unique order reference generator */
export function generateRef(prefix = "TXN"): string {
  return `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
}