import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/api/user/$id')({
  server: {
    handlers: {
      GET: async function handler(arg) {
        const url = new URL(arg.request.url)
        console.log("from api: ", arg)
        // const search = arg.url.searchParams
        // console.log(Object.fromEntries(search.entries()))
        const { id } = arg.params
        return new Response(id + "::::" + JSON.stringify(arg.context))
      }
    }
  },
})
