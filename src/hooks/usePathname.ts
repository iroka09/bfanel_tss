
import { useRouter } from '@tanstack/react-router'


export const usePathname = () => {
  const router = useRouter()
  const pathname = router.state.location.pathname
  return pathname
}