
import { createServerFn } from '@tanstack/react-start'
import { loginFn } from "@/server/actions/session";
import { OAuth2Client } from 'google-auth-library';
import z from "zod"


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export const verifyCredentialWithGoogle = createServerFn({ method: "POST" })
  .inputValidator(z.object({ credential: z.string().min(10) }))
  .handler(async ({ data: { credential } }): Promise<{ success: boolean } | null> => {
    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      const payload = ticket.getPayload();
      if (!payload.email_verified) throw Error("email not verified")
      const result = await loginFn({
        data: {
          oneTapLogin: {
            userId: payload.sub,
            name: payload.name,
            email: payload.email,
            picture: payload.picture,
            isVerified: true,
          }
        }
      });
      return { success: result.success }
    }
    catch (error) {
      console.error("Invalid token:", error);
      return { success: false }
    }
  })
