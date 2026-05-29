
import { createFileRoute } from "@tanstack/react-router";
import { createHmac } from "node:crypto"




interface OPayCallbackPayload {
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



interface OPayWebhookBody {
  payload: OPayCallbackPayload;
  sha512: string;
  type: string;
}

function verifyWebhookSignature(
  body: OPayWebhookBody,
  privateKey: string
): boolean {
  const { payload, sha512 } = body;
  // OPay's exact format — capital keys, Refunded as t/f, NO quotes on booleans
  const signString = `{Amount:"${payload.amount}",Currency:"${payload.currency}",Reference:"${payload.reference}",Refunded:${payload.refunded ? "t" : "f"},Status:"${payload.status}",Timestamp:"${payload.timestamp}",Token:"${payload.token ?? ""}",TransactionID:"${payload.transactionId}"}`;
  const hmac = createHmac("sha3-512", privateKey).update(signString).digest("hex")
  const hmac2 = createHmac("sha512", privateKey).update(signString).digest("hex")
  console.log("hmac: ", hmac)
  console.log("hmac2: ", hmac2)
  console.log("sha512: ", sha512)
  return hmac.toLowerCase() === sha512.toLowerCase();
}


function response(msg, responseHeaders, err) {
  if (err) console.log("webhook catche(err): ", err)
  console.log(msg)
  return new Response(msg, responseHeaders)
}


//x-real-ip = 119.13.76.156 // opay's ip address
export const Route = createFileRoute("/api/opay/opay_webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {

        //PROTECTION 1
        const OPAY_IP = request.headers.get("x-real-ip")
        if (OPAY_IP !== "119.13.76.156") {
          return response("Request not trusted", { status: 400 });
        }

        // PROTECTION 2
        let body: OPayWebhookBody
        try {
          body = await request.json() as OPayWebhookBody
        } catch (e) {
          return response("Invalid JSON", { status: 400 }, e);
        }
        // Signature is in body.sha512, NOT in any header
        const receivedSig = body.sha512;
        if (!receivedSig) {
          return response("Missing signature", { status: 401 });
        }
        const privateKey = process.env.OPAY_PRIVATE_KEY || "OPAYPRV16168120782850.889353996330442";
        let isValid: boolean;
        try {
          isValid = verifyWebhookSignature(body, privateKey);
        } catch (e) {
          return response("Signature error", { status: 500 }, e);
        }
        if (!isValid) {
          return response("Invalid signature", { status: 401 });
        }
        // === PROTECTION ENDS ===

        // === BELOW IS SAFE, HACKERS CAN'T GET DOWN HERE
        const { reference, status, amount } = body.payload;
        console.log("webhook amount: ", amount)
        switch (status) {
          case "SUCCESS":
            // ✅ Mark order as paid in your DB
            // e.g. await db.orders.update({ reference }, { status: "paid", paidAt: new Date() })
            console.log(`webhook: ✅ Payment SUCCESS — ref: ${reference}, amount: ₦${amount}`);
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