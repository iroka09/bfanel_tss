import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  OPAY_BASE_URL,
  generateRef,
  opayHeaders,
} from "@/lib/opay.server";
import type { CreateOrderPayload, CreateOrderResponse } from "~/lib/opay.types";




const InitPaymentSchema = z.object({
  amountInKobo: z.number().positive(), // pass amount in kobo, e.g. 500000 = ₦5000
  productId: z.string().min(1),
  productDescription: z.string().min(1),
  userEmail: z.string().email(),
  userId: z.string().min(1),
  userName: z.string().min(1),
  userMobile: z.string().min(10),
});


const isDev = process.env.NODE_ENV === "development"


export type InitPaymentInput = z.infer<typeof InitPaymentSchema>;




export const initOpayPayment = createServerFn({ method: "POST" })
  .inputValidator(InitPaymentSchema)
  .handler(async ({ data, context: { url } }) => {
    const APP_URL = isDev ? "http://localhost:3000" : url.origin;
    const reference = generateRef("BFANEL");

    // Opay expects amount as a decimal string in Naira
    const nairaAmount = (data.amountInKobo / 100).toFixed(2);

    const body: CreateOrderPayload = {
      amount: { total: nairaAmount, currency: "NGN" },
      callbackUrl: `${APP_URL}/api/opay/webhook`,
      cancelUrl: `${APP_URL}/payment/failed?ref=${reference}`,
      country: "NG",
      productList: {
        productId: data.productId,
        description: data.productDescription,
      },
      reference,
      returnUrl: `${APP_URL}/payment/success?ref=${reference}`,
      userInfo: {
        userEmail: data.userEmail,
        userId: data.userId,
        userName: data.userName,
        userMobile: data.userMobile,
      },
      expireAt: 30,
    };

    const res = await fetch(`${OPAY_BASE_URL}/api/v1/international/cashier/create`, {
      method: "POST",
      headers: opayHeaders(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Opay API error: ${res.status} ${res.statusText}`);
    }

    const result: CreateOrderResponse = await res.json();

    if (result.code !== "00000" || !result.data?.cashierUrl) {
      throw new Error(result.message ?? "Failed to create Opay order");
    }

    return {
      cashierUrl: result.data.cashierUrl,
      reference: result.data.reference,
    };
  });





// ------- Query payment status -------
const QueryStatusSchema = z.object({ reference: z.string().min(1) });

export const queryOpayPaymentStatus = createServerFn({ method: "POST" })
  .inputValidator(QueryStatusSchema)
  .handler(async ({ data }) => {
    const body = {
      reference: data.reference,
      country: "NG",
    };

    const res = await fetch(
      `${OPAY_BASE_URL}/api/v1/international/cashier/query`,
      {
        method: "POST",
        headers: opayHeaders(body),
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) throw new Error(`Opay status check failed: ${res.status}`);

    const result = await res.json();
    return result as { code: string; message: string; data?: { status: string } };
  });