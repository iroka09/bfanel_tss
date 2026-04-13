import React from "react"
import { Link } from "@tanstack/react-router";



const isDev = process.env.NODE_ENV === "development"


type LinkType = React.ComponentProps<typeof Link>

type NavLink = LinkType & {
  label?: string
}



const navLinks: NavLink[] = [
  (isDev ? { label: "Login", to: "/login" } : null) as unknown as LinkType,
  (isDev ? { label: "Learn", to: "/learn", preload: "intent" } : null) as unknown as LinkType,
  (isDev ? { label: "customer care", to: "/customer_care", preload: "intent" } : null) as unknown as LinkType,
  { label: "About Us", to: "/about" },
  { label: "Products", to: "/#products" },
  { label: "Services", to: "/#services" },
  { label: "FAQs", to: "/#faqs" },
  { label: "Contact", to: "/#contact" },
];


export default function Nav(): React.ReactNode {
  return (
    <nav>
      <ul className="flex p-5 flex-col md:flex-row md:space-x-5 in-[.mobile]:divide-y in-[.mobile]:divide-black/20 in-[.mobile]:dark:divide-white/20">
        {navLinks.filter(x => x).map(({ label, ...props }) => (
          <li key={label}>
            <Link
              activeProps={{
                className: "text-blue-500 font-bold"
              }}
              className="block hover:in-[.mobile]:bg-black/10 dark:hover:in-[.mobile]:bg-white/10 text-center in-[.mobile]:font-bold in-[.mobile]:py-3 in-[.mobile]:text-lg "
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