
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
      <section className="flex flex-col space-y-5 md:flex-row pt-2 pb-10 md:px-5 md:gap-2">
        <div className="container text-primary md:pt-5 space-y-5 py-5 flex flex-col md:flex-row-reverse *:flex-1 gap-2">
          <div className="relative w-fill aspect-square">
            {<img src="/bfanel.jpg" alt="Company's hero image of services" className="block mx-auto mb-2 object-contain" loading="eager" />}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-5xl uppercase font-[700] font-open_sans bg-gradient-to-br from-primary from-30% to-cyan-400 bg-clip-text text-transparent">
              Bfanel Industries Limited.
            </h1>
            <p className="inline-block py-3 text-md">
              Your <span className="text-secondary-fixed font-bold">Trusted</span> Partner in Electrical & Plumbing Piping Systems. <br />
              Specializes in the production of top-quality plumbing and electrical conduit pipes. Our mission is to deliver durable, innovative, and environmentally friendly piping solutions while ensuring customer satisfaction.
            </p>
            <HeroButtons />
          </div>
        </div>
        {/*<div className="md:max-h-[300px] overflow-hidden">
          <image src={bfanelPic} alt="Bfanel pipes sample" className="max-h-full object-fit" />
        </div>*/}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-2">
        <div>
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

          {/*" Services "*/}
          {/*   <section id="services" className="pt-16">
            <div className="container">
              <h2 className="text-3xl font-bold text-primary mb-6 uppercase">Our Services</h2>
              <Card>
                <ul className="space-y-4">
                  <li>✔ Custom Pipe Manufacturing</li>
                  <li>✔ Installation Consultancy</li>
                  <li>✔ Bulk Orders and Distribution</li>
                </ul>
              </Card>
              <hr className="border border-black/10 mt-16" />
            </div>
          </section>*/}


          {/*" Certifications "*/}
          {/*<section className="bg-gray-100 dark:bg-slate-900 py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-primary mb-6">Certifications & Quality Assurance</h2>
          <p className="text-lg leading-relaxed">
            B-Fanel Industries is ISO 9001 certified and adheres to strict industry standards to ensure the highest product quality. Our pipes undergo rigorous testing to meet durability and safety requirements.
          </p>
        </div>
      </section>*/}

          {/*" Testimonials "*/}
          <section className="py-16 bg-neutral-100 dark:bg-slate-600">
            <div className="container">
              <h1 className="text-2xl font-bold text-primary mb-6 uppercase">What Our Clients Say</h1>
              <div className="py-0 ">
                <Testimonials />
              </div>
            </div>
          </section>
        </div>
        <div>
          {/*" Join us"*/}
          <section className="relative career-background py-16">
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 from-40% via-black/70 via-70% to-black/40"></div>
            <div className="container relative z-1">
              <h1 className="text-2xl font-bold text-white mb-6 uppercase">Join Our Team</h1>
              <p className="text-lg text-white/80">
                We're always looking for talented individuals to join our growing team. Send your CV to: <Link to="mailto: info@bfanelindustries.com" className="text-secondary-light underline underline-offset-2" aria-label="bfanel email">info@bfanelindustries.com</Link>
              </p>
            </div>
          </section>

          {/*" Faqs "*/}
          <section id="faqs" className="py-16 bg-secondary-dark text-white">
            <div className="container">
              <h1 className="text-2xl font-bold mb-6 uppercase">Frequently Asked Questions</h1>
              <Faqs />
            </div>
          </section>

          <div className="contact-us-background bg-slate-800">
            <ContactForm />
            <Footer />
          </div>

        </div>
      </div>
    </main >
  );
}
