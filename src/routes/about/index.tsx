
import { useEffect } from "react"
import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { AboutUs } from "@/components/LearnMore"
import { getInfo /*useAppSession*/ } from "@/server/utils"
import Footer from "@/components/Footer"




let loaderCache = {}

export const Route = createFileRoute('/about/')({
  head: async () => {
    return ({
      meta: [
        { title: "About Us" }
      ]
    })
  },
  beforeLoad: async (xx) => {
    // let res = await useAppSession()
    // console.log("beforeLoad: ", xx)
    return { beforeLoad: "yes" }
  },
  loader: async ({ context }) => {
    try {
      let result = await getInfo({
        data: { msg: "loader" }
      })
      // console.log("loader: ", context)
      loaderCache = { loaderCache, ...result }//cache the result incase if there is network failure in subsequent network req
      return result
    }
    catch (e) {
      return loaderCache
    }
  },
  component: About
})



function About() {
  const get_info = useServerFn(getInfo)
  // const data1 = Route.useRouteContext()
  const loaderData = Route.useLoaderData()
  const submit = async function () {
    let result = await get_info({
      data: {
        msg: "app component",
        age: "554543",
        student: true
      }
    })
    alert(JSON.stringify(result, null, 2))
  }
  return (
    <>
      <div className="p-5 mb-5">
        {process.env.NODE_ENV === "development" &&
          <button
            //hidden
            className="rounded-md px-5 py-1 bg-secondary hover:bg-secondary-dark text-white text-lg"
            onClick={submit}
          >
            Click To Get Infos
          </button>
        }
        <span hidden className="italic text-bold">{loaderData.val}</span>
        <h1 className="text-4xl font-bold py-3 mb-5">ABOUT US</h1>
        <img src="/bfanel.jpg" alt="about bfanel" height="200" width="300" className="object-contain mb-4 mx-auto" />
        <AboutUs />
      </div>
      <Footer />
    </>)
}