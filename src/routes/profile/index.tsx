
import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useSession } from '@/context/session';
import { getUser, ensureAuth } from '@/server/actions/session';
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"


export const Route = createFileRoute('/profile/')({
  beforeLoad: async ({ location }) => {
    await ensureAuth({ data: { redirect: location.href } })
  },
  loader: async () => {
    const user = await getUser();
    return user
  },
  component: Profile,
})


function Profile() {
  const user = Route.useLoaderData()
  const { signOut } = useSession()
  useEffect(() => {
    console.log(user)
  }, [])
  return (<>
    <section className="px-5 py-2">
      <Card className="block p-3">
        <div className="flex flex-col items-center gap-3">
          <img src={user.picture} className="w-[80px] max-w-[80%] aspect-square !rounded-full border-2" alt="avatar" />
          <h2 className="text-2xl">{user.name}</h2>
          <h2 className="text-sm">({user.email})</h2>
        </div>
        {process.env.NODE_ENV === "development"&&
        <div className="overflow-auto">
          <pre>
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
        }
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
