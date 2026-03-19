

import { createFileRoute } from '@tanstack/react-router'
import { AboutUs } from "@/components/LearnMore"
import Footer from "@/components/Footer"




export const Route = createFileRoute('/about/')({
  head: () => ({
    meta: [
      { title: "About Us" }
    ]
  }),
  component: About
})


function About() {
  return (
    <>
      <div className="p-5 mb-5">
        <h1 className="text-4xl font-bold py-3">ABOUT US</h1>
        <image src="/logo_high.png" alt="bfanel logo" height="200" width="300" className="object-contain mb-4 mx-auto" />
        <AboutUs />
      </div>
      <Footer />
    </>)
}