
import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useSession } from '@/context/session';
import { ensureAuth } from '@/server/actions/session';
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"



export const Route = createFileRoute('/profile/')({
  beforeLoad: async ({ location }) => {
    await ensureAuth({ data: { redirect: location.href } })
  },
  component: Profile,
})


function Profile() {
  const { session, isAuthenticated, signOut } = useSession({ redirect: true })
  //  if (!isAuthenticated) return null
  return (<>
    <section className="px-5 py-2">
      <Card className="flex flex-col items-center gap-3 !p-5">
        <img src={session.picture} className="w-[80px] max-w-[80%] aspect-square !rounded-full border-2" alt="avatar" />
        <h2 className="text-2xl">{session.name}</h2>
        <h2 className="text-sm">({session.email})</h2>
      </Card>
      <div className="my-5">
        <Button
          onClick={async () => {
            await signOut({ redirect: true })
          }}>
          Sign Out
        </Button>
      </div>
    </section>
  </>)
}
