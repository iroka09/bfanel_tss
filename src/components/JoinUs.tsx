
import { Link } from "@tanstack/react-router";



export default function App() {
  return (<>
    <div className="absolute inset-0 bg-gradient-to-b from-black/80 from-40% via-black/70 via-70% to-black/40"></div>
    <div className="container relative z-1">
      <h1 className="section-title text-white mb-6 uppercase md:text-3xl lg:text-4xl">Join Our Team</h1>
      <p className="text-lg text-white/80">
        We're always looking for talented individuals to join our growing team. Send your CV to: <Link to="mailto: info@bfanelindustries.com" className="text-secondary-light underline underline-offset-2" aria-label="bfanel email">info@bfanelindustries.com</Link>
      </p>
    </div>
  </>)
}