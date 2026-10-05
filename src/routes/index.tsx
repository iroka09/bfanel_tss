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
import { MessageCircleMore } from "lucide-react";

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
        aria-label="Chat with the B-Fanel AI assistant"
        className="group flex flex-col items-center gap-1.5 outline-none"
      >
        <span className="relative">
          {/* Soft pulse. Switched off for visitors who prefer reduced motion */}
          <span className="pointer-events-none absolute inset-0 rounded-full bg-orange-500/25 motion-safe:animate-ping [animation-duration:2.8s]" />

          {/* Main button */}
          <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#2d3d63] via-[#1e2840] to-[#141b2e] text-white shadow-lg shadow-[#1e2840]/40 ring-[3px] ring-white transition-all duration-300 before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent group-hover:-translate-y-0.5 group-hover:shadow-xl group-hover:shadow-orange-500/30 group-active:scale-95 group-focus-visible:ring-orange-500 dark:ring-slate-700">
            <MessageCircleMore
              className="relative h-[22px] w-[22px]"
              strokeWidth={1.8}
            />
          </span>

          {/* Online dot */}
          <span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
        </span>

        {/* Label */}
        <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-semibold leading-4 text-[#1e2840] shadow-sm ring-1 ring-slate-200 backdrop-blur dark:bg-slate-900/95 dark:text-slate-100 dark:ring-slate-700">
          Ask AI
        </span>
      </Link>
    </div>
  )
}
