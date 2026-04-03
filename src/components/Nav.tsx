//import { ReactNode } from "react"
import { Link } from "@tanstack/react-router";

type NavLink = {
  label: string;
  href: string;
};

const navLinks: NavLink[] = [
  { label: "About Us", href: "/about" },
  { label: "Products", href: "/#products" },
  { label: "Services", href: "/#services" },
  { label: "FAQs", href: "/#faqs" },
  { label: "Contact", href: "/#contact" },
];


export default function Nav(){
  return (
    <nav>
      <ul className="flex p-5 flex-col md:flex-row md:space-x-5 [.mobile_&]:divide-y [.mobile_&]:divide-black/20  [.mobile_&]:dark:divide-white/20">
        {navLinks.map((link) => (
          <li key={link.label}>
            <Link
              to={link.href}
              activeProps={{
                className: "text-blue-500 font-bold"
              }}
              className="block hover:[.mobile_&]:bg-black/10 dark:hover:[.mobile_&]:bg-white/10 text-center [.mobile_&]:font-bold [.mobile_&]:py-3 [.mobile_&]:text-lg "
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}