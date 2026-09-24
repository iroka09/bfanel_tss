
import { OpayButton } from "@/components/OpayButton"
import { useAppSession } from '@/context/session';



export default function PaymentsWrapper(props) {
  const { isAuthenticated } = useAppSession()
  if (!isAuthenticated || process.env.NODE_ENV === "production") return null
  return (
    <div className="fixed w-full bottom-0 px-5 py-1 z-[100] bg-white/10 backdrop-blur-[2px] sm:max-w-[400px] sm:rounded-lg">
      <OpayButton
        amount="11000"
        productId="prod_123"
        productDescription="Premium subscription"
        userEmail="user@example.com"
        userId="user_456"
        userName="Chisom Iroka"
        userMobile="08012345678"
        label="Pay ₦5,000"
      />
    </div>
  )
}