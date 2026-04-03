
import { createFileRoute } from '@tanstack/react-router'
import YouTube from "@/components/Youtube_video"
import { Link } from "@tanstack/react-router";
import Card from "@/components/Card"
import Faqs from "@/components/Faqs"
import About from "@/components/About"
import Products from "@/components/Products"
import HeroButtons from "@/components/HeroButtons"
import ContactForm from "@/components/ContactForm"
import Testimonials from "@/components/Testimonials"
import Footer from "@/components/Footer"




export const Route = createFileRoute('/')({
  component: App
})


function App() {
  return (
    <main className="[&_h2]:font-open_sans">
      {/*" Hero Section "*/}
      <section>
        <div className="relative text-primary w-full mb-5 overflow-hidden">
          <div className="absolute inset-0">
            {<img src="/hero_image.jpg" alt="Company's hero image of services" className="absolute object-cover h-full w-full" loading="eager" />}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-l from-transparent to-black/80 to-60%"></div>
          <div className="relative z-1 flex flex-col items-start justify-end text-center md:text-left p-8 pt-60 text-white max-w-[800px]">
            <h1 className="text-5xl lg:text-7xl uppercase font-[700] font-open_sans bg-gradient-to-br from-white from-30% to-cyan-400 bg-clip-text text-transparent">
              Bfanel Industries Limited.
            </h1>
            <p className="inline-block py-3 lg:text-lg">
              Your <span className="text-secondary-fixed font-bold">Trusted</span> Partner in Electrical & Plumbing Piping Systems. <br />
              Specializes in the production of top-quality plumbing and electrical conduit pipes. Our mission is to deliver durable, innovative, and environmentally friendly piping solutions while ensuring customer satisfaction.
            </p>
            <HeroButtons />
          </div>
        </div>
      </section>

      <div className="">

        {/*" About Us "*/}
        <section id="about" className="bg-gray-200 dark:bg-slate-800 py-5">
          <div id="about" className="container">
            <About />
          </div>
        </section>
        {/*" Video "*/}
        <section id="video" className="py-5">
          <YouTube
            id="Bkg9yt2FJGc"
            title="B-Fanel Industries"
          />
        </section>

        {/*" Products "*/}
        <section id="products">
          <Products />
        </section>

        {/*" Testimonials "*/}
        <section className="py-16 bg-neutral-100 dark:bg-slate-600">
          <div className="container">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-10 uppercase">What Our Clients Say</h1>
            <div className="py-0 ">
              <Testimonials />
            </div>
          </div>
        </section>

        {/*" Join us"*/}
        <section className="relative career-background py-16">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 from-40% via-black/70 via-70% to-black/40"></div>
          <div className="container relative z-1">
            <h1 className="text-2xl font-bold text-white mb-6 uppercase md:text-3xl lg:text-4xl">Join Our Team</h1>
            <p className="text-lg text-white/80">
              We're always looking for talented individuals to join our growing team. Send your CV to: <Link to="mailto: info@bfanelindustries.com" className="text-secondary-light underline underline-offset-2" aria-label="bfanel email">info@bfanelindustries.com</Link>
            </p>
          </div>
        </section>

        {/*" Faqs "*/}
        <section id="faqs" className="py-16 bg-secondary-dark text-white">
          <div className="container">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 uppercase">Frequently Asked Questions</h1>
            <Faqs />
          </div>
        </section>

        {/*" Form and Footer "*/}
        <section className="contact-us-background bg-slate-800">
          <ContactForm />
          <Footer />
        </section>

      </div>
    </main >
  );
}
