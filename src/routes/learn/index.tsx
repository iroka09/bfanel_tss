import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { Button } from "@/components/ui/button";


const isDev = process.env.NODE_ENV === "development"



export const Route = createFileRoute('/learn/')({
  head: () => ({
    meta: [
      { title: 'Learn' }
    ]
  }),
  validateSearch: (raw) => {
    return {
      page: Number(raw.page ?? 1),
      filter: (raw.filter as string) ?? 'all',
      sort: (raw.sort as 'asc' | 'desc') ?? 'asc',
    }
  },
  beforeLoad: async ({ search }) => {
    console.log("beforeLoad search: ", search)
    if (typeof window) return { val: "beforeLoad client" }
    else return { val: "beforeLoad server" }
  },
  loaderDeps: ({ search }) => {
    console.log("loaderDeps search: ", search)
    return {
      page: search.page,
      filter: search.filter,
      sort: search.sort,
    }
  },
  /*loader: {
    handler: async ({ params, deps, context, location }) => {
      if (typeof window) return { val: "loader client" }
      else return { val: "loader server" }
    },
    staleReloadMode: 'background', //blocking
  },*/
  loader: async ({ cause }): Promise<{ val: string; num: string }> => {
    await new Promise(res => setTimeout(res, 2000))
    console.log("loader cause: ", cause)
    const num = Math.random().toString().slice(-4) + "yeah"
    if (typeof window) return { val: "loader client", num }
    else return { val: "loader server", num }
  },
  staleTime: 1000 * 60, // 60 seconds
  preloadStaleTime: 1000 * 20, // 20 seconds
  gcTime: 1000 * 60 * 10,
  preloadMaxAge: 1000 * 60,
  //shouldReload: true,
  pendingMs: 0,
  pendingMinMs: 1000 * 5,
  pendingComponent: () => (
    <div className="skeleton">loading...</div>
  ),
  component: PostPage,
})


function PostPage() {
  const loaderData = Route.useLoaderData()
  const router = useRouter()
  // const { page, filter } = Route.useSearch()
  // const { postId } = Route.useParams()
  // const { user } = Route.useRouteContext()

  return (
    <div>
      <h1 className="text-4xl font-black">Welcome</h1>
      <pre>
        <code>
          {JSON.stringify(loaderData, null, 2)}
        </code>
      </pre>
      <Button
        onClick={() => router.invalidate()}
        size={'lg'}
      >
        invalidate
      </Button>
    </div>
  )
}







/*
export const Route = createFileRoute('/posts/$postId')({

  // ════════════════════════════════════════════════════════════
  // ROUTE MATCHING
  // ════════════════════════════════════════════════════════════

  // Whether the URL match is case-sensitive.
  // Default: false
  caseSensitive: false,


  // ════════════════════════════════════════════════════════════
  // PATH PARAMS
  // ════════════════════════════════════════════════════════════

  params: {
    // Parse raw string path params into typed values.
    // Throw here to put the route in an error state.
    // Replaces deprecated `parseParams`.
    parse: (raw) => ({
      postId: Number(raw.postId),
    }),

    // Serialize typed params back to strings when building URLs.
    // Replaces deprecated `stringifyParams`.
    stringify: (params) => ({
      postId: String(params.postId),
    }),
  },


  // ════════════════════════════════════════════════════════════
  // SEARCH PARAMS (QUERY STRING)
  // ════════════════════════════════════════════════════════════

  // Validate and parse raw query string into typed search params.
  // Throwing here puts the route in an error state.
  // Return type is inferred across the whole router.
  validateSearch: (raw) => ({
    page: Number(raw.page ?? 1),
    filter: (raw.filter as string) ?? 'all',
    sort: (raw.sort as 'asc' | 'desc') ?? 'asc',
  }),

  // Transform search params whenever links are generated for
  // this route or its descendants.
  // Replaces the deprecated `preSearchFilters` and `postSearchFilters`.
  search: {
    middlewares: [
      ({ search, next }) => {
        // Always forward 'filter' in generated links
        return next({ ...search, filter: search.filter ?? 'all' })
      },
    ],
  },


  // ════════════════════════════════════════════════════════════
  // DATA LOADING
  // ════════════════════════════════════════════════════════════

  // Runs before the loader. Ideal for auth guards and injecting
  // data into context. Runs on BOTH server and client.
  // - Return an object → merged into route context
  // - Throw redirect() → cancel navigation and redirect
  // - Throw an error → route enters error state
  beforeLoad: async ({ context, params, location, search, cause, buildLocation }) => {
    // `cause` is 'enter' | 'stay' 
    return { user: "tochi" }
    if (!context.auth?.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }

    // Returned object is merged into route context, available in loader
    return { user: context.auth.user }
  },

  // What changes in search params should cause the loader to re-run.
  // Path params are tracked automatically; use this for search params.
  // The return value is passed to loader as `deps`.
  loaderDeps: ({ search }) => ({
    page: search.page,
    filter: search.filter,
    sort: search.sort,
  }),

  // Fetch data for this route.
  // Can be a plain function OR an object with `handler` + `staleReloadMode`.
  loader: {
    handler: async ({
      params,    // typed path params
      deps,      // what loaderDeps returned
      context,   // merged context from beforeLoad + parent routes
      location,  // current parsed location
      cause,     // 'enter' | 'stay' | 'preload'
      preload,   // true if this is a preload call
      abortController, // cancel long-running fetches on unmount
      parentMatchPromise, // resolves when parent route's loader finishes
      route  // The AnyRoute object for this route itself. Useful for accessing route.id or route.options.
    }) => {
      return { post: Math.random() }
      await parentMatchPromise // wait for parent data if needed

      if (abortController.signal.aborted) return

      const post = await fetch(`/api/posts/${params.postId}?page=${deps.page}`, {
        signal: abortController.signal,
      }).then((r) => r.json())

      return { post }
    },

    // How stale loader data is revalidated:
    // 'background' → revalidate silently while showing old data (swr-style)
    // 'blocking'   → wait for reload to complete before rendering
    staleReloadMode: 'background',
  },


  // ════════════════════════════════════════════════════════════
  // CACHING
  // ════════════════════════════════════════════════════════════

  // How long (ms) loader data is considered fresh.
  // During this window, navigating back won't re-run the loader.
  // Default: routerOptions.defaultStaleTime (0 = always refetch)
  staleTime: 1000 * 60 * 5, // 5 minutes

  // How long (ms) preloaded data is considered fresh specifically
  // during preloading. Normal staleTime takes over on actual navigation.
  // Default: 30_000 (30 seconds)
  preloadStaleTime: 1000 * 30,

  // How long (ms) loader data stays in memory after the route unmounts.
  // Default: 30 minutes
  gcTime: 1000 * 60 * 10,

  // Max time (ms) preloaded data is kept before being discarded
  // if the user never navigates to that route.
  // Default: 30_000 (30 seconds)
  preloadMaxAge: 1000 * 60,

  // Whether the loader should re-run on subsequent matches:
  // false     → never re-run (only runs on first entry)
  // true      → always re-run on every match
  // undefined → follow normal staleTime behavior
  shouldReload: false,


  // ════════════════════════════════════════════════════════════
  // SSR
  // ════════════════════════════════════════════════════════════

  // Whether this route participates in server-side rendering.
  // Set to false to make it client-only (beforeLoad/loader won't run on server).
  ssr: true,

  // Set custom HTTP response headers when this route renders on the server.
  headers: ({ loaderData, params, match, matches }) => ({
    'Cache-Control': 'private, max-age=300',
    'X-Post-Id': String(params.postId),
  }),


  // ════════════════════════════════════════════════════════════
  // HEAD / META
  // ════════════════════════════════════════════════════════════

  // Inject elements into the document <head> for this route.
  // Supports: meta, links, styles, scripts.
  head: ({ loaderData, params, match, matches }) => ({
    meta: [
      { title: loaderData?.post?.title ?? 'Post' },
      { name: 'description', content: loaderData?.post?.excerpt },
      { property: 'og:title', content: loaderData?.post?.title },
    ],
    links: [
      { rel: 'canonical', href: `https://example.com/posts/${params.postId}` },
      { rel: 'preload', href: '/fonts/inter.woff2', as: 'font' },
    ],
    styles: [
      { href: '/styles/post.css' },
    ],
    scripts: [],
  }),

  // Shorthand to only inject <script> tags into <head>.
  // Equivalent to returning `scripts` from the `head` option above.
  scripts: ({ loaderData, params }) => [
    { src: 'https://cdn.example.com/prism.js', async: true },
  ],


  // ════════════════════════════════════════════════════════════
  // PENDING / LOADING UI
  // ════════════════════════════════════════════════════════════

  // How long (ms) to wait before showing pendingComponent.
  // Prevents a spinner flash on fast connections.
  // Default: routerOptions.defaultPendingMs (1000)
  pendingMs: 300,

  // Minimum time (ms) pendingComponent stays visible once shown.
  // Prevents it from flashing away too quickly.
  // Default: routerOptions.defaultPendingMinMs (500)
  pendingMinMs: 500,

  // Rendered while the loader is running (after pendingMs threshold).
  pendingComponent: () => (
    <div className="skeleton">Loading post...</div>
  ),


  // ════════════════════════════════════════════════════════════
  // RENDERING
  // ════════════════════════════════════════════════════════════

  // Force this route to be wrapped in a React Suspense boundary,
  // even if the router doesn't detect a need for one automatically.
  wrapInSuspense: false,

  // Determines when the route's component should fully remount.
  // Return a JSON-serializable value — component remounts if it changes
  // between navigations. By default, it never remounts if it stays active.
  remountDeps: ({ params, search, loaderDeps, routeId }) => params.postId,

  // Fine-grained control over how lazy-loaded route pieces are
  // grouped into JS chunks during code-splitting.
  // Each inner array = one chunk.
  codeSplitGroupings: [
    ['component', 'pendingComponent'],
    ['loader'],
    ['errorComponent', 'notFoundComponent'],
  ],


  // ════════════════════════════════════════════════════════════
  // ERROR HANDLING
  // ════════════════════════════════════════════════════════════

  // Rendered when an error is thrown in loader or beforeLoad.
  errorComponent: ({ error, reset }) => (
    <div>
      <p>Something went wrong: {error.message}</p>
      {
        //reset() retries the loader and clears the error 
      }
<button onClick={reset}>Try again</button>
    </div >
  ),

// Rendered when notFound() is thrown inside loader or beforeLoad.
notFoundComponent: () => <div>Post not found!</div>,

  // Called when an error is thrown during navigation or preload.
  // You can throw a redirect() from here to recover.
  onError: ({ error }) => {
    console.error('[Route Error]', error)
  },

    // Called when the React CatchBoundary catches a render-time error.
    onCatch: (error, errorInfo) => {
      console.error('[Caught Error]', error, errorInfo)
    },


      // ════════════════════════════════════════════════════════════
      // LIFECYCLE EVENTS
      // ════════════════════════════════════════════════════════════

      // Called when this route becomes active for the first time
      // (was NOT matched in the previous location).
      onEnter: (match) => {
        console.log('Entered:', match.routeId)
      },

        // Called when this route remains active across navigations
        // (was ALSO matched in the previous location).
        onStay: (match) => {
          console.log('Stayed on:', match.routeId)
        },

          // Called when this route becomes inactive
          // (was matched before but is NO LONGER matched).
          onLeave: (match) => {
            console.log('Left:', match.routeId)
          },


            // ════════════════════════════════════════════════════════════
            // COMPONENT
            // ════════════════════════════════════════════════════════════

            component: function PostPage() {
              const { post } = Route.useLoaderData()
              const { page, filter } = Route.useSearch()
              const { postId } = Route.useParams()
              const { user } = Route.useRouteContext()

              return (
                <article>
                  <h1>{post.title}</h1>
                  <p>By {user.name}</p>
                  <p>Page {page} — Filter: {filter}</p>
                </article>
              )
            },
})
*/