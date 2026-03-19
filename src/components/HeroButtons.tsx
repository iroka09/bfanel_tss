
import { Link } from "@tanstack/react-router";
import LearnMoreButton from "@/components/LearnMore"

const subject = "INQUIRY ABOUT YOUR PRODUCTS"
const body = `
Dear Sales Team,

I hope this message finds you well.

I am writing to inquire about your products at Bfanel Industries Limited, specifically regarding your quality PVC pipes and plastics.

Could you please provide me with the following information?

Availability of the PVC pipes and plastics
Pricing details
Shipping options and timelines
Any additional specifications or features.

Thank you for your assistance. I look forward to your prompt response so that I can make an informed decision.

Best regards. 
`

const shopNowLink = `mailto: info@bfanelindustries.com?subject=${subject}&body=${encodeURIComponent(body)}`




export default function HeroButtons() {
  return (
    <div className="flex flex-col md:flex-row gap-3">
      <Link
        to={shopNowLink}
        className="inline-block px-5 py-2 text-xl text-white shadow-md rounded-full hover:opacity-80 transition active:translate-y-[5px] w-full bg-gradient-to-r from-primary-light to-secondary via-red-900 font-[600] text-center"
      >
        Shop Now
      </Link>
      <LearnMoreButton />
    </div>
  )
}