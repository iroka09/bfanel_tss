
import React from "react"
import { createFileRoute } from '@tanstack/react-router'
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardFooter } from "@/components/ui/card";
import { redirect, useRouter } from '@tanstack/react-router'
import { getSession, logoutFn } from "@/server/actions/session"
import { getAiMessage } from "@/server/actions/gemini_ai"
import { cn } from "@/lib/utils"
import { type DataSchemaType } from "@/server/actions/gemini_ai";
import { toast } from "sonner"


export const Route = createFileRoute('/customer_care/')({
  beforeLoad: async () => {
    const result = await getSession()
    console.log("/customer_care: ", result)
    if (!result) throw redirect({ to: "/login" })
  },
  component: RouteComponent,
  // loader: async () => await getAiMessage()
})


type HistoryType = Pick<DataSchemaType, "history">


function RouteComponent() {
  const router = useRouter()
  const [message, setMessage] = React.useState("")
  const [history, setHistory] = React.useState<HistoryType>(fakeData || [])
  const [isPending, startTransition] = React.useTransition()
  const [isPendingLogout, startTransitionLogout] = React.useTransition()
  //const res = Route.useLoaderData()
  const handleLogout = () => {
    startTransitionLogout(async () => {
      try {
        await logoutFn()
        router.navigate({ to: "/login", replace: true })
      }
      catch (e) {
        console.log(e)
        toast.error("Unable to logout")
      }
    })
  }
  const handleSubmit = () => {
    startTransition(async () => {
      //  await new Promise(res => setTimeout(res, 1000))
      const result = await getAiMessage({
        data: {
          content: message
        }
      })
      if (result.success) {
        toast.success("Submitted", {
          description: result.message,
          position: "bottom-center",
          action: {
            label: "Undo",
            onClick: () => { },
          },
        })
        return
      }
      else {
        alert(result.message)
        return
      }
      setHistory(_prev => {
        const prev = _prev ?? []
        const lastObj = prev[prev.length - 1]
        //push message to last obj if it is from user
        if (lastObj) {
          if (lastObj.role === "user") {
            return [
              ...prev.slice(0, -1),
              {
                ...lastObj,
                parts: [...lastObj.parts, { text: message }]
              }
            ]
          }
        }
        return [
          ...prev,
          {
            role: "user",
            parts: [{ text: message }]
          }]
      })
      setMessage("")
    })
  }

  return (<>
    <section className="flex flex-col gap-2 p-5 h-[80vh]">
      <div className="">
        <h1 className="text-xl md:text-2xl">Ai assistance</h1>
      </div>
      <div className="border h-[95%] flex flex-col">
        <div className="flex-1 flex flex-col gap-5 overflow-auto p-2">
          {history?.length === 0 ?
            <span className="m-auto">No chat available right now</span>
            :
            history?.map((obj, i) => (
              obj.parts?.map((part, j) => (
                <div
                  key={obj.role + i + "-" + part.text + j}
                // className="bg-red-400"
                >
                  <Card
                    className={cn(
                      "flex p-2 max-w-[90%]",
                      obj.role === "user" && "ml-auto bg-slate-500/10 dark:bg-white/20 ",
                      obj.role === "user" && j === 0 && "!rounded-tr-none",
                      obj.role === "model" && j === 0 && "!rounded-tl-none",
                    )}
                  >
                    {part.text}
                  </Card>
                </div>
              ))
            ))
          }
        </div>
        <CardFooter className="flex gap-2 items-end rounded-none">
          <Textarea
            placeholder="Ask anything..."
            className="!h-[10px] max-h-[200px]"
            value={message}
            rows={1}
            onChange={(e) => {
              setMessage(e.target.value)
            }}
          />
          <Button disabled={isPending} onClick={handleSubmit}>{isPending ? "Sending..." : "Send"}</Button>
        </CardFooter>
      </div>
    </section>
    <Button disable={isPendingLogout} onClick={handleLogout}>{isPendingLogout ? "please wait..." : "Logout"}</Button>
  </>)
}


const fakeData = []/* || [
  {
    role: "user",
    parts: [
      { text: "Hey" }
    ]
  },
  {
    role: "model",
    parts: [
      { text: "Hi there!" },
      { text: "How can I help you today?" }
    ]
  }
];*/