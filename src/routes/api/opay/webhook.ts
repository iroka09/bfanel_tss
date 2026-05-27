import { createFileRoute } from "@tanstack/react-start/api";
import { verifyWebhookSignature } from "@/lib/opay.server";
import type { WebhookPayload } from "@/lib/opay.types";


export const APIRoute = createFileRoute("/api/opay/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const receivedSig = request.headers.get("Authorization")?.replace("Bearer ", "") ?? "";

        let payload: WebhookPayload;
        try {
          payload = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        // Verify it's really Opay
        if (!verifyWebhookSignature(payload, receivedSig)) {
          return new Response("Invalid signature", { status: 401 });
        }

        const { reference, status, amount } = payload;

        switch (status) {
          case "SUCCESS":
            // ✅ Mark order as paid in your DB
            // e.g. await db.orders.update({ reference }, { status: "paid", paidAt: new Date() })
            console.log(`✅ Payment SUCCESS — ref: ${reference}, amount: ₦${amount.total}`);
            break;

          case "FAIL":
          case "CLOSE":
            // ❌ Mark order as failed
            console.log(`❌ Payment FAILED — ref: ${reference}`);
            break;

          case "PENDING":
            console.log(`⏳ Payment PENDING — ref: ${reference}`);
            break;
        }

        // Opay expects a 200 with this exact body to stop retrying
        return Response.json({ code: "00000", message: "success" });
      }
    }
  }
});