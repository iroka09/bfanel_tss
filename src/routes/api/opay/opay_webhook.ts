
import { createFileRoute } from "@tanstack/react-router";
import { verifyWebhookSignature } from "@/server/opay.server";
import type { WebhookPayload } from "@/server/opay.types";



function response(msg, responseHeaders, err) {
  if (err) console.log("webhook catche(err): ", err)
  console.log(msg)
  return new Response(msg, responseHeaders)
}


export const Route = createFileRoute("/api/opay/opay_webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const receivedSig = request.headers.get("Authorization")?.replace(/^Bearer\s+/, "") ?? "";
        console.log("receivedSig: ", receivedSig)
        if (!receivedSig) {
          return response("Missing signature", { status: 401 });
        }
        let payload: WebhookPayload;
        try {
          payload = await request.json();
        } catch (e) {
          return response("Invalid JSON", { status: 400 }, e);
        }
        let isValid: boolean;
        try {
          isValid = verifyWebhookSignature(payload, receivedSig);
        } catch (e) {
          return response("Signature verification error", { status: 500 }, e);
        }
        if (!isValid) {
          return response("Invalid signature", { status: 401 });
        }
        const { reference, status, amount } = payload;
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