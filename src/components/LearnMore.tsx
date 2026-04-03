
import { Drawer } from "vaul";
import { IoClose } from "react-icons/io5";




export default function LearnMore() {
  return (
    <Drawer.Root direction="bottom">
      <Drawer.Trigger asChild>
        <button
          className="inline-block px-5 py-2 text-xl border-2 border-white text-white rounded-full transition active:translate-y-[5px] w-full font-[600] hover:bg-white hover:text-black transition"
        >
          Learn More
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <div className="relative z-[50]">
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="fixed bottom-0 h-[90%] w-full bg-white dark:bg-black text-primary p-5 rounded-t-3xl flex flex-col">
            <Drawer.Handle className="flex-shrink-0" />
            <div className="w-full py-2 flex justify-end ">
              <Drawer.Close>
                <IoClose className="text-3xl" />
              </Drawer.Close>
            </div>
            <div className="overflow-y-auto flex-1 max-w-6xl mx-auto py-3 md:px-12 lg:px-20 overflow-auto">
              <Drawer.Title className="text-2xl md:text-3xl font-bold mb-6">
                More About Our Pipe Solutions
              </Drawer.Title>
              <Drawer.Description asChild>
                <div><AboutUs hideTitle /></div>
              </Drawer.Description>
            </div>
          </Drawer.Content>
        </div>
      </Drawer.Portal>
    </Drawer.Root>
  )
}



export function AboutUs({ hideTitle }) {
  return (
    <>
      {hideTitle || <h2 className="text-2xl md:text-3xl font-bold mb-6">
        More About Our Pipe Solutions
      </h2>}
      <div className="[&_p]:text-slate-700 [&_p]:tex-base [&_p]:dark:text-slate-300 [&_div.border]:border-slate-400/50">
        <p className="leading-relaxed mb-6">
          Our pipes are manufactured using high-grade raw materials and modern production
          processes to ensure durability, smooth water flow, and long-term performance.
          We produce plumbing and electrical conduit pipes in a wide range of sizes,
          allowing contractors, engineers, and distributors to find the exact specifications
          required for residential, commercial, and industrial projects.
        </p>

        <p className="leading-relaxed mb-6">
          Every product is designed to meet strict quality standards and withstand pressure,
          environmental conditions, and daily usage. From small installations to large-scale
          construction, our pipes are built for reliability, safety, and ease of installation.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-10">
          <div className="p-6 rounded-2xl border">
            <h3 className="text-xl font-semibold mb-3">
              Wide Range of Sizes
            </h3>
            <p className="">
              We manufacture pipes in multiple diameters and thicknesses to suit different
              water flow capacities, wiring systems, and structural requirements. This ensures
              flexibility for various construction and infrastructure needs.
            </p>
          </div>

          <div className="p-6 rounded-2xl border">
            <h3 className="text-xl font-semibold mb-3">
              Reliable Manufacturing
            </h3>
            <p className="">
              Our production process focuses on consistency and strength. Each pipe undergoes
              quality checks to guarantee performance, durability, and compliance with industry
              expectations.
            </p>
          </div>

          <div className="p-6 rounded-2xl border ">
            <h3 className="text-xl font-semibold mb-3">
              Multiple Applications
            </h3>
            <p className="">
              Suitable for plumbing systems, electrical conduit installations, water supply,
              and construction projects. Our pipes are trusted by technicians, builders,
              and distributors across different sectors.
            </p>
          </div>

          <div className="p-6 rounded-2xl border">
            <h3 className="text-xl font-semibold mb-3">
              Customer-Focused Supply
            </h3>
            <p className="">
              We prioritize timely production, consistent sizing, and dependable supply to
              support projects of all scales. Our goal is to deliver products that simplify
              installation and improve long-term system performance.
            </p>
          </div>
        </div>
      </div>
    </>)
}