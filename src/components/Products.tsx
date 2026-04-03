
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
      <div className="px-5">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-6 mb-9 uppercase">Our Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {datas.map(data => (
            <div className="w-full">
              <Card noPadding key={data.title}>
                <h2 className="text-xl font-bold p-4">{data.title}</h2>
                <div className="w-full h-[250px] relative">
                  <img
                    src={data.imageSrc}
                    className="object-cover h-full w-full"
                    alt={data.alt}
                  />
                </div>
                <p className="p-4">{data.body}</p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>)
}