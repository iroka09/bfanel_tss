
import Card from "@/components/Card"


export default function Expertise() {
  return (
    <div className="container">
      <div className="!w-full">
        <div className="section-title relative inline-block font-bold uppercase mb-7 after:content-[''] after:absolute after:h-[3px] after:bg-amber-500 after:top-[115%] after:left-[5%] after:w-[50%] after:rounded-full">
          Our Expertise
        </div>
        <div className="md:grid grid-cols-2 gap-5">
          <img
            src="/images-2.jpg"
            className="block w-full h-full object-cover"
            alt="White Pressure pipes for plumbing"
          />
          <div className="py-5 md:py-0">
            With years of experience in the industry, we specialize in a wide range of sizes and specifications to accommodate various requirements. Our team of skilled professionals works tirelessly to innovate and improve our manufacturing processes, ensuring that our customers receive the best products available on the market.
          </div>
        </div>
      </div>
    </div>
  )
}

