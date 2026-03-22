
import { useEffect } from "react"
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
  useEffect(() => {
    //  alert(process.env.NODE_ENV)
  }, [])
  return (
    <>
      <div className="p-5 mb-5">
        {process.env.NODE_ENV === "development" &&
          <button
            //hidden
            className="rounded-md px-5 py-1 bg-secondary hover:bg-secondary-dark text-white text-lg"
            onClick={submit}
          >
            Get Infos
          </button>
        }
        <h1 className="text-4xl font-bold py-3 mb-5">ABOUT US</h1>
        <img src="/logo_high.png" alt="bfanel logo" height="200" width="300" className="object-contain mb-4 mx-auto" />
        <AboutUs />
      </div>
      <Footer />
    </>)
}