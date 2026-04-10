import React from "react"
import { Link } from "@tanstack/react-router";



const isDev = process.env.NODE_ENV === "development"



type LinkType = React.ComponentProps<typeof Link>

type NavLink = React.ComponentProps<typeof Link> & {
  label: string
}



const navLinks: NavLink[] = [
  isDev ? { label: "Learn", to: "/learn", preload: "intent" } : undefined,
  { label: "About Us", to: "/about" },
  { label: "Products", to: "/#products" },
  { label: "Services", to: "/#services" },
  { label: "FAQs", to: "/#faqs" },
  { label: "Contact", to: "/#contact" },
];


export default function Nav(): React.ReactNode {
  return (
    <nav>
      <ul className="flex p-5 flex-col md:flex-row md:space-x-5 [.mobile_&]:divide-y [.mobile_&]:divide-black/20  [.mobile_&]:dark:divide-white/20">
        {navLinks.map(({ label, ...props }) => (
          <li key={label}>
            <Link
              activeProps={{
                className: "text-blue-500 font-bold"
              }}
              className="block hover:[.mobile_&]:bg-black/10 dark:hover:[.mobile_&]:bg-white/10 text-center [.mobile_&]:font-bold [.mobile_&]:py-3 [.mobile_&]:text-lg "
              {...props}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}