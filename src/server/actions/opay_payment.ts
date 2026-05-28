import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  generateRef,
  opayHeaders,
} from "@/server/opay.server";
import type { CreateOrderPayload, CreateOrderResponse } from "~/server/opay.types";



const InitPaymentSchema = z.object({
  amount: z.string(),
  productId: z.string().min(1),
  productDescription: z.string().min(1),
  userEmail: z.string().email(),
  userId: z.string().min(1),
  userName: z.string().min(1),
  userMobile: z.string().min(10),
});

export type InitPaymentInput = z.infer<typeof InitPaymentSchema>;


const isDev = process.env.NODE_ENV === "development"
const OPAY_BASE_URL: string = process.env.OPAY_BASE_URL as string;



export const initPayment = createServerFn({ method: "POST" })
  .inputValidator(InitPaymentSchema)
  .handler(async ({ data, context: { url } }) => {
    try {
      const APP_URL = isDev ? "http://localhost:3000" : url.origin;
      const reference = generateRef("BFANEL");
      // console.log(OPAY_BASE_URL)
      const body: CreateOrderPayload = {
        displayName: "BFANEL PVC PIPE INDUSTRY",
        country: "EG", // NG or EG
        reference,
        amount: {
          total: Number(data.amount),
          currency: "EGP" // NGN or EGP
        },
        returnUrl: `${APP_URL}/payment/opay_success?ref=${reference}`,
        callbackUrl: `https://bfanel.vercel.app/api/opay/opay_webhook`,
        cancelUrl: `${APP_URL}/payment/opay_cancel?ref=${reference}`,
        expireAt: 300,
        userInfo: {
          userEmail: data.userEmail,
          userId: data.userId,
          userMobile: data.userMobile,
          userName: data.userName
        },
        productList: [
          {
            productId: data.productId,
            name: "PVC Pipe",
            description: data.productDescription,
            price: 13000,
            quantity: 2,
            imageUrl: `${APP_URL}/conduit_pipes.jpg`
          }
        ],
        // payMethod: "BankCard"
      };

      const res = await fetch(`${OPAY_BASE_URL}/api/v1/international/cashier/create`, {
        method: "POST",
        headers: opayHeaders(),
        body: JSON.stringify(body),
      }).catch(e => {
        console.log(e)
        throw e
      });

      if (!res.ok) {
        throw new Error(`Opay API error: ${res.status} ${res.statusText}`);
      }

      const result: CreateOrderResponse = await res.json();
      console.log("order cashier result: ", result)
      if (result.code !== "00000" || !result.data?.cashierUrl) {
        throw new Error(result.message ?? "Failed to create Opay order");
      }
      return result
    }
    catch (e) {
      console.log(e)
      throw Error("Something went wrong.")
    }
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