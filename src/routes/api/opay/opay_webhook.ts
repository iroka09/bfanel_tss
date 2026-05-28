
import { createFileRoute } from "@tanstack/react-router";
import { verifyWebhookSignature } from "@/server/opay.server";
import type { WebhookPayload } from "@/server/opay.types";
import { sha3_512 } from "js-sha3";
// js-sha3 supports HMAC-SHA3-512 via createHmac



export interface OPayCallbackPayload {
  amount: string;
  channel: string;
  country: string;
  currency: string;
  displayedFailure: string;
  fee: string;
  feeCurrency: string;
  instrumentType: string;
  reference: string;
  refunded: boolean;
  status: string;
  timestamp: string;
  token: string;
  transactionId: string;
  updated_at: string;
}



export interface OPayWebhookBody {
  payload: OPayCallbackPayload;
  sha512: string;
  type: string;
}

export function verifyWebhookSignature(
  body: OPayWebhookBody,
  privateKey: string
): boolean {
  const { payload, sha512: receivedSig } = body;
  // OPay's exact format — capital keys, Refunded as t/f, NO quotes on booleans
  const signString = `{Amount:"${payload.amount}",Currency:"${payload.currency}",Reference:"${payload.reference}",Refunded:${payload.refunded ? "t" : "f"},Status:"${payload.status}",Timestamp:"${payload.timestamp}",Token:"${payload.token ?? ""}",TransactionID:"${payload.transactionId}"}`;
  const hmac = sha3_512.hmac(privateKey, signString); // HMAC-SHA3-512
  return hmac.toLowerCase() === receivedSig.toLowerCase();
}


function response(msg, responseHeaders, err) {
  if (err) console.log("webhook catche(err): ", err)
  console.log(msg)
  return response(msg, responseHeaders)
}


export const Route = createFileRoute("/api/opay/opay_webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        console.log(`HEADERS`);
        request.headers.forEach((value, key) => {
          console.log(`${key} = ${value}`);
        });
        try {
          body = await request.json();
        } catch (e) {
          return response("Invalid JSON", { status: 400 });
        }
        // Signature is in body.sha512, NOT in any header
        const receivedSig = body.sha512;
        if (!receivedSig) {
          return response("Missing signature", { status: 401 });
        }
        const privateKey = process.env.OPAY_PRIVATE_KEY!;
        let isValid: boolean;
        try {
          isValid = verifyWebhookSignature(body, privateKey);
        } catch (e) {
          return response("Signature error", { status: 500 });
        }
        if (!isValid) {
          return response("Invalid signature", { status: 401 });
        }
        const { reference, status, amount } = body.payload;
        console.log("webhook amount: ", amount)
        switch (status) {
          case "SUCCESS":
            // ✅ Mark order as paid in your DB
            // e.g. await db.orders.update({ reference }, { status: "paid", paidAt: new Date() })
            console.log(`webhook: ✅ Payment SUCCESS — ref: ${reference}, amount: ₦${amount?.total}`);
            break;
          case "FAIL":
          case "CLOSE":
            // ❌ Mark order as failed
            console.log(`webhook: ❌ Payment FAILED — ref: ${reference}`);
            break;

          case "PENDING":
            console.log(`webhook: ⏳ Payment PENDING — ref: ${reference}`);
            break;
          default:
            // Unknown status — log it, still ack so OPay doesn't spam retries,
            // but you know to investigate
            console.warn(`⚠️ Webhook: unknown payment status "${status}" — ref: ${reference}`);
            break
        }
        // Opay expects a 200 with this exact body to stop retrying
        console.log("webhook: api is successful, code will return 0000")
        return Response.json({ code: "00000", message: "success" }); //no matter the status we have to return this success, it means that opay incoming request was handled
      }
    }
  }
});