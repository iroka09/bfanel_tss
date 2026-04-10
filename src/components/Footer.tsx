
import { Link } from "@tanstack/react-router";
import SocialMediaContacts from "@/components/SocialMediaContacts"



export default function App() {
  return (
    <footer className="bg-neutral-950 [&_*]:!text-neutral-300 py-5">
      <div className="container">
        <div className="flex justify-center my-3 always-white">
          <SocialMediaContacts />
        </div>
        <div className="my-2 text-sm">
          <Link to="https://wa.me/+2349014864168" className="text-white/80 underline underline">Contact the developer</Link>
        </div>
        <p className="text-sm text-center text-white/60 mt-5 pt-3 border-t border-t-white/10">&copy; {new Date().getFullYear() + " • "} All Rights Reserved.</p>
      </div>
    </footer>
  )
}