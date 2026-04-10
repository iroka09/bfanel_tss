
import { createFileRoute } from "@tanstack/react-router"
import AboutUs from "@/components/AboutUs"



export const Route = createFileRoute('/about/')({
  head: async () => {
    return ({
      meta: [
        { title: "About Us" }
      ]
    })
  },
  component: About
})



function About() {
  return (
    <div className="p-5 mb-5">
      <AboutUs
        titleComponent={(
          <>
            <h1 className="text-4xl font-bold py-3 mb-5">ABOUT US</h1>
            <img src="/bfanel.jpg" alt="about bfanel" height="200" width="300" className="object-contain mb-4 mx-auto" />
          </>
        )}
      />
    </div>
  )
}