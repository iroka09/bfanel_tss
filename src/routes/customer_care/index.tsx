
import React from "react"
import { createFileRoute } from '@tanstack/react-router'
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardFooter } from "@/components/ui/card";
import { getAiMessage } from "@/server/actions/gemini_ai"
import { cn } from "@/lib/utils"
import { type DataSchemaType } from "@/server/actions/gemini_ai";




export const Route = createFileRoute('/customer_care/')({
  component: RouteComponent,
  // loader: async () => await getAiMessage()
})


type HistoryType = Pick<DataSchemaType, "history">


function RouteComponent() {
  const [message, setMessage] = React.useState("")
  const [history, setHistory] = React.useState<HistoryType>(fakeData || [])
  const [isPending, startTransition] = React.useTransition()
  //const res = Route.useLoaderData()
  const handleSubmit = () => {
    startTransition(async () => {
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
        return [{
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
        <div className="grid grid-cols-1 gap-2 overflow-auto items-start p-2">
          {history?.length === 0 ?
            <span className="m-auto">No chat available right now</span>
            :
            history?.map(obj => (
              obj.parts?.map(part => (
                <div>
                  <Card
                    className={cn(
                      "flex p-2 max-w-[90%]",
                      obj.role === "user" && "ml-auto bg-amber-200/20"
                    )}
                  >
                    {part.text}
                  </Card>
                </div>
              ))
            ))
          }
        </div>
        <CardFooter className="flex gap-2 items-center">
          <Textarea
            placeholder="Ask anything..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
            }}
          />
          <Button disabled={isPending} onClick={handleSubmit}>Send</Button>
        </CardFooter>
      </div>
    </section>
  </>)
}


const fakeData = [
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
  },
  {
    role: "user",
    parts: [
      { text: "Explain promises in JavaScript" }
    ]
  },
  {
    role: "model",
    parts: [
      { text: "A Promise represents a value that may be available now, later, or never." },
      { text: "It helps handle asynchronous operations more cleanly than callbacks." },
      { text: "You can use .then(), .catch(), and async/await with it." }
    ]
  },
  {
    role: "user",
    parts: [
      { text: "Give me an example" },
      { text: "Make it simple" }
    ]
  },
  {
    role: "model",
    parts: [
      { text: "Sure." },
      { text: "const p = new Promise((resolve) => {" },
      { text: "  setTimeout(() => resolve('Done'), 1000);" },
      { text: "});" },
      { text: "p.then(console.log);" }
    ]
  },
  {
    role: "user",
    parts: [
      { text: "Nice, I understand now" }
    ]
  },
  {
    role: "model",
    parts: [
      { text: "Great!" },
      { text: "Let me know if you want to dive deeper into async/await." }
    ]
  }
];