
import { createFileRoute } from '@tanstack/react-router'
import YouTube from "@/components/Youtube_video"
import { Link } from "@tanstack/react-router";
import Card from "@/components/Card"
import Faqs from "@/components/Faqs"
import Expertise from "@/components/Expertise"
import Products from "@/components/Products"
import JoinUs from "@/components/JoinUs"
import HeroButtons from "@/components/HeroButtons"
import ContactForm from "@/components/ContactForm"
import Testimonials from "@/components/Testimonials"
import Footer from "@/components/Footer"




export const Route = createFileRoute('/')({
  component: App
})


function App() {
  // return (<h1>testing</h1>)
  return (
    <main className="text-lg">
      {/*" Hero Section "*/}
      <section>
        <div className="relative text-primary w-full mb-5 overflow-hidden">
          <div className="absolute inset-0">
            {<img src="/hero_image.jpg" alt="Company's hero image of services" className="absolute object-cover h-full w-full" loading="eager" />}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-l from-transparent to-black/80 to-60%"></div>
          <div className="relative z-1 flex flex-col items-start justify-end text-center md:text-left p-8 pt-60 text-white max-w-[800px]">
            <h1 className="text-5xl lg:text-7xl uppercase font-[700] font-sans bg-gradient-to-br from-white from-30% to-cyan-400 bg-clip-text text-transparent">
              Quality Pipes Built to Last.
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

        {/*" Video */}
        <section id="video" className="py-5">
          <YouTube
            id="Bkg9yt2FJGc"
            title="B-Fanel Industries"
          />
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
          <Footer />
        </section>

      </div>
    </main >
  );
}
