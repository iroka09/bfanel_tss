
import React from "react";
import { Link } from "@tanstack/react-router";
import SocialMediaContacts from "@/components/SocialMediaContacts"
import { createServerFn } from "@tanstack/react-start";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";



const zodSchema = z.object({
  email: z.email({
    error: (issue) => {
      return issue.input ? issue.input + ' is a wrong email address.' : 'This field is required.'
    }
  }).trim()
})

const submitEmail = createServerFn({ method: 'GET' })
  .inputValidator((data: z.infer<typeof zodSchema>) => data)
  .handler(async ({ data }) => {
    console.log(data)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const res = await zodSchema.safeParse(data)
      console.log(res)
      if (res.success === false) {
        return { result: res.error.issues[0].message }
      }
      return { result: data.email + ' has subscribed successfully.' }
    }
    catch (error) {
      console.error(error)
      return { result: ' Ooops! something went wrong.' }
    }
  })



export default function App() {
  const [email, setEmail] = React.useState('')
  const [isSubmitting, startTransition] = React.useTransition()
  const handleSubmit = () => {
    startTransition(async () => {
      const { result } = await submitEmail({
        data: { email }
      })
      console.log(result)
      alert(result)
    })
  }
  return (
    <footer className="dark bg-neutral-950 [&_*]:text-neutral-300 py-5">
      <div className="container">
        <div className="flex justify-center my-3">
          <SocialMediaContacts />
        </div>
        <div className="my-2 text-sm">
          <div className="md:max-w-[50%] mx-auto flex flex-col my-6">
            <h3 className="!text-amber-400 py-2 text-xs">Subscribe to our Newsletter to stay updated on our products</h3>
            <form className="flex gap-2 flex-row">
              <Input
                placeholder="Enter your email"
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                className="uppercase shrink-0 !text-black bg-amber-400 font-semibold text-xs rounded-lg px-3 hover:bg-amber-500 transition gap-2"
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  submitting...
                </> :
                  'submit'
                }
              </Button>
            </form>
          </div>
          <Link to="https://wa.me/+2349014864168" className="text-white/80 underline underline">Contact the developer</Link>
        </div>
        <p className="text-sm text-center text-white/60 mt-5 pt-3 border-t border-t-white/10">&copy; {new Date().getFullYear() + " • "} All Rights Reserved.</p>
      </div>
    </footer>
  )
}