
import { Link } from "@tanstack/react-router";
import { Drawer } from "vaul";
import { IoClose } from "react-icons/io5";
import AboutUs from "@/components/AboutUs"



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
    <div className="flex flex-col md:flex-row gap-3 w-full">
      <Link
        to={shopNowLink}
        className="inline-grid place-items-center py-2 px-9 text-lg text-white shadow-md rounded-full hover:opacity-80 transition active:translate-y-[5px] w-full bg-gradient-to-r from-amber-500 to-secondary font-[600] text-center uppercase"
      >
        Go Shopping
      </Link>
      <LearnMoreButton title={"Learn More"} />
    </div>
  )
}


function LearnMoreButton({ title = "click me" }: { title: string }) {
  return (
    <Drawer.Root direction="bottom">
      <Drawer.Trigger asChild>
        <button
          className="inline-block px-5 py-2 text-lg border border-neutral-300 text-white rounded-full transition active:translate-y-[5px] w-full font-[600] hover:bg-neutral-300 hover:text-black transition uppercase"
        >
          {title}
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <div className="relative flex justify-center z-[50]">
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="fixed bottom-0 h-[80%] w-full max-w-[700px] mx-auto bg-white dark:bg-neutral-900 text-primary p-5 rounded-t-3xl flex flex-col">
            <Drawer.Handle className="flex-shrink-0" />
            <div className="w-full py-2 flex justify-end ">
              <Drawer.Close>
                <IoClose className="text-3xl" />
              </Drawer.Close>
            </div>
            <div className="overflow-y-auto flex-1 max-w-6xl mx-auto py-3 md:px-12 lg:px-20 overflow-auto">
              <Drawer.Description asChild>
                <div>
                  <AboutUs
                    titleComponent={
                      <Drawer.Title className="text-2xl md:text-3xl font-bold mb-6 uppercase">
                        More About Our Pipe Solutions
                      </Drawer.Title>
                    }
                  />
                </div>
              </Drawer.Description>
            </div>
          </Drawer.Content>
        </div>
      </Drawer.Portal>
    </Drawer.Root>
  )
}