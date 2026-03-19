

import { Link } from "@tanstack/react-router";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaTwitter } from "react-icons/fa6";


type SocialsType = Array<{
  icon: ReactNode
  url: string
}>


const socials: SocialsType = [
  {
    icon: <FaFacebook />,
    url: "https://facebook.com/profile.php?id=61575553090887",
  },
  {
    icon: <IoLogoWhatsapp />,
    url: "https://wa.me/+2348068233614",
  },
  {
    icon: <FaTwitter />,
    url: "https://x.com/bfanel_limited",
  },
  {
    icon: <FaInstagram />,
    url: "https://www.instagram.com/bfanelindustrieslimited/",
  }
]

export default function Social() {
  return (
    <div className="flex gap-1 items-center w-fit justify-evenly">
      {socials.map(({ icon, url }) => (
        <Link
          key={url}
          to={url}
          className="border rounded-full p-2 text-lg aspect-square border-primary text-primary hover:bg-slate-300/40 [.always-white_&]:!text-white [.always-white_&]:!border-white"
        >
          {icon}
        </Link>
      ))}
    </div>
  )
}