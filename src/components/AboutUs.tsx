
import React from "react"
import { Drawer } from "vaul";
import { IoClose } from "react-icons/io5";




export default function AboutUs({ titleComponent }: { titleComponent?: React.ReactNode }) {
  return (
    <>
      {titleComponent}
      <div className="[&_div.border]:border-neutral-400/50 text-lg">
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

        <div className="grid md:grid-cols-2 gap-8 mt-10 [&_h3]:uppercase">
          <div className="p-6 rounded-2xl border">
            <h3 className="text-xl mb-3">
              Wide Range of Sizes
            </h3>
            <p className="">
              We manufacture pipes in multiple diameters and thicknesses to suit different
              water flow capacities, wiring systems, and structural requirements. This ensures
              flexibility for various construction and infrastructure needs.
            </p>
          </div>

          <div className="p-6 rounded-2xl border">
            <h3 className="text-xl mb-3">
              Reliable Manufacturing
            </h3>
            <p className="">
              Our production process focuses on consistency and strength. Each pipe undergoes
              quality checks to guarantee performance, durability, and compliance with industry
              expectations.
            </p>
          </div>

          <div className="p-6 rounded-2xl border ">
            <h3 className="text-xl mb-3">
              Multiple Applications
            </h3>
            <p className="">
              Suitable for plumbing systems, electrical conduit installations, water supply,
              and construction projects. Our pipes are trusted by technicians, builders,
              and distributors across different sectors.
            </p>
          </div>

          <div className="p-6 rounded-2xl border">
            <h3 className="text-xl mb-3">
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