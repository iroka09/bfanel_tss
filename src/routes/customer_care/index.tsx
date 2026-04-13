
import React from "react"
import { createFileRoute } from '@tanstack/react-router'
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardFooter } from "@/components/ui/card";
import { getAiMessage } from "@/server/actions/gemini_ai";
import { type DataSchemaType } from "@/server/actions/gemini_ai";


export const Route = createFileRoute('/customer_care/')({
  component: RouteComponent,
  // loader: async () => await getAiMessage()
})


type HistoryType = Pick<DataSchemaType, "history">


function RouteComponent() {
  const [message, setMessage] = React.useState("")
  const [history, setHistory] = React.useState<HistoryType>([])
  //const res = Route.useLoaderData()
  const handleSubmit = () => {

  }
  return (<>
    <section className="flex flex-col gap-2 px-5 h-[80vh]">
      <div className="">
        <h1 className="text-xl md:text-2xl">Ai assistance</h1>
      </div>
      <Card className="flex-1 flex flex-col">
        <div className="flex-1 grid grid-cols-1 place-items-center overflow-auto">
          <span>No chat available right now</span>
        </div>
        <CardFooter className="flex gap-2 items-center">
          <Input
            placeholder="Ask anything..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
            }}
          />
          <Button onClick={handleSubmit}>Send</Button>
        </CardFooter>
      </Card>
    </section>
  </>)
}
