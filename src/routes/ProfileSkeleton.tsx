import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ProfileSkeleton')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/ProfileSkeleton"!</div>
}
