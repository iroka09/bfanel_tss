
import { clsx } from "clsx"
import Card from "@/components/Card"

const datas = [
  {
    title: "Plumbing Pipes",
    alt: "White Plumbing Pipes",
    imageSrc: "/images-3.jpg",
    body: "High-quality pipes designed for efficient water flow and plumbing systems, produced in a variety of sizes to meet different project and installation requirements."
  },
  {
    title: "Electrical Conduit Pipes",
    alt: "Electrical 20mm Conduit Pipes",
    imageSrc: "/conduit_pipes.jpg",
    body: "Durable pipes for safe and efficient electrical wiring installations."
  }
]

export default function Products() {
  return (<>
    <svg
      viewBox="0 0 400 60"
      className="relative bg-transparnt md:hidden -mb-2"
    >
      {/*Wave svg shape*/}
      <path
        d="M0 20 Q100 -20, 200 20 T400 20 V60 H0 z"
        fill="red"
        className="fill-amber-500"
      />
      <path
        d="M0 25 Q110 -10, 210 25 T400 25 V60 H0 z"
        fill="red"
        className="fill-secondary-dark"
      />
    </svg>
    <div className="relative bg-secondary-dark text-white py-6">
      <div className="container">
        <h1
          className={clsx(
            "inline-block relative section-title mt-6 mb-9 uppercase",
            "after:content-[''] after:absolute after:h-[3px] after:bg-amber-500 after:top-[115%] after:left-[5%] after:w-[50%] after:rounded-full"
          )}
        >
          Our Products
        </h1>
        <div className="grid grid-cols-1 gap-4 w-full">
          {datas.map(data => (
            <div
              key={data.title}
              className="w-full"
            >
              <Card noPadding className="">
                <Card.Title className="uppercase">{data.title}</Card.Title>
                <Card.Content>
                  <Card.Image
                    imageProps={{
                      src: data.imageSrc,
                      className: "object-cover h-full w-full",
                      alt: data.alt
                    }}
                  />
                  <Card.Body className="py-5">{data.body}</Card.Body>
                </Card.Content>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>)
}