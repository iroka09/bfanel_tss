

import { createFileRoute } from '@tanstack/react-router'
import { AboutUs } from "@/components/LearnMore"
import { getInfo } from "@/server/utils"
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

  const submit = async () => {
    let result = await getInfo({ data: { name: "_Chisom" } })
    alert(JSON.stringify(result, null, 2))
  }

  return (
    <>
      <div className="p-5 mb-5">
        <button
          //hidden
          className="rounded-md px-5 py-2 bg-black text-white text-2xl"
          onClick={submit}
        >
          Get Info
        </button>
        <h1 className="text-4xl font-bold py-3 mb-5">ABOUT US</h1>
        <img src="/logo_high.png" alt="bfanel logo" height="200" width="300" className="object-contain mb-4 mx-auto" />
        <AboutUs />
      </div>
      <Footer />
    </>)
}