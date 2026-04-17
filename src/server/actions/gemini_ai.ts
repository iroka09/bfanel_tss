
import { createServerFn } from "@tanstack/react-start"
import { GoogleGenAI } from '@google/genai';
import * as z from "zod"


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});


export const dataSchema = z.object({
  content: z.string(),
  history: z.array(
    z.object({
      role: z.union([z.literal("user"), z.literal("model")]),
      parts: z.array(z.object({ text: z.string() }))
    })
  )
    .optional()
})

export type DataSchemaType = z.infer<typeof dataSchema>

type ReturnType = {
  success: boolean,
  message: string
}

async function getResponse(data: DataSchemaType): Promise<ReturnType> {
  try {
    await dataSchema.parse(data)
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: data.content
    });
    return { success: true, message: response.text() };
  }
  catch (error) {
    console.warn(error)
    return { success: false, message: "Something went wrong." }
  }
}


export const getAiMessage = createServerFn({ method: "POST" })
  //.inputValidator((data: DataSchemaType) => data)
  .handler(async ({ data }) => {
    //  return process.env.GEMINI_API_KEY
    const result = await getResponse(data)
    return result
  })