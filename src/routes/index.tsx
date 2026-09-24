import { createFileRoute, useRouter, Link } from '@tanstack/react-router'
import YouTube from '@/components/Youtube_video'
import Faqs from '@/components/Faqs'
import Expertise from '@/components/Expertise'
import Products from '@/components/Products'
import JoinUs from '@/components/JoinUs'
import HeroButtons from '@/components/HeroButtons'
import ContactForm from '@/components/ContactForm'
import Testimonials from '@/components/Testimonials'
import { Headset, Sparkles } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: App,
})

function Test() {
  return <h1>TESTING Index...</h1>
}

///hero_image.jpg
function App() {
  // return (<h1>testing</h1>)
  const router = useRouter()
  return (
    <main className="text-lg">
      {/*" Hero Section "*/}
      <section
        className="relative text-primary w-full mb-5 overflow-hidden"
        style={{
          backgroundImage: 'url(/hero_image.jpg)',
          backgroundSize: 'auto 100%',
          backgroundPosition: '80%',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute pointer-events-none inset-0 bg-gradient-to-b md:bg-gradient-to-l from-transparent to-black/80 to-60%"></div>
        <div className="relative z-1 text-center md:text-left p-8 pt-60 text-white max-w-[800px]">
          <h1 className="text-5xl lg:text-7xl uppercase font-[700] bg-gradient-to-br from-white from-30% to-cyan-400 bg-clip-text text-transparent">
            Quality Pipes Built to Last.
          </h1>
          <p className="inline-block py-3 lg:text-lg">
            Your <span className="text-secondary-fixed font-bold">Trusted</span>{' '}
            Partner in Electrical & Plumbing Piping Systems. <br />
            Specializes in the production of top-quality plumbing and electrical
            conduit pipes. Our mission is to deliver durable, innovative, and
            environmentally friendly piping solutions while ensuring customer
            satisfaction.
          </p>
          <HeroButtons />
        </div>
      </section>

      <div className="">
        {/*" Video */}
        <section id="video" className="py-5">
          <YouTube id="Bkg9yt2FJGc" title="B-Fanel Industries" />
        </section>
        {/*" About Us "*/}
        <section id="about" className="py-5">
          <Expertise />
        </section>
        {/*" Products "*/}
        <section id="products">
          <Products />
        </section>
        {/*" Testimonials "*/}
        <section className="py-16 bg-neutral-100 dark:bg-transparent">
          <Testimonials />
        </section>
        {/*" Join us"*/}
        <section className="relative career-background py-16">
          <JoinUs />
        </section>
        {/*" Faqs "*/}
        <section id="faqs" className="py-16 bg-secondary-dark text-white">
          <Faqs />
        </section>
        {/*" Form and Footer "*/}
        <section className="contact-us-background bg-slate-800">
          <ContactForm />
        </section>
      </div>
      <FloatingAssistantButton />
    </main>
  )
}

export function FloatingAssistantButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group">
      {/* Tooltip banner on hover */}
      <span className="hidden sm:inline-flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 bg-slate-900/90 dark:bg-slate-100/90 text-white dark:text-slate-900 text-xs font-semibold px-3.5 py-2 rounded-2xl shadow-xl backdrop-blur-md pointer-events-none whitespace-nowrap">
        <Sparkles className="w-3.5 h-3.5 text-blue-400 dark:text-blue-600" />
        Chat with Customer Care
      </span>

      {/* Main Floating Action Button */}
      <Link
        to="/assistant"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-110 active:scale-95 transition-all duration-300 ring-4 ring-white dark:ring-slate-900"
        aria-label="Contact B-Fanel Customer Care Assistant"
      >
        {/* Animated outer pulse glow */}
        <span className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping opacity-75 pointer-events-none" />

        {/* Customer Care Icon or Image representation */}
        <div className="relative flex items-center justify-center">
          <Headset className="w-7 h-7 text-white transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12" />
        </div>

        {/* Online status indicator dot */}
        <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
        </span>
      </Link>
    </div>
  )
}
