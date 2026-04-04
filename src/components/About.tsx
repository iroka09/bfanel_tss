
import Card from "@/components/Card"


export default function About() {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      <AboutCard
        title="About Us"
        alt="ADMIN BLOCK"
        imageSrc="/ADMIN_BLOCK.jpg"
        body="B-Fanel Industries specializes in the production of top-quality plumbing and electrical conduit pipes. Our mission is to deliver durable, innovative, and environmentally friendly piping solutions while ensuring customer satisfaction. Our vision is to be a global leader in the piping industry through excellence and innovation."
      />

      <AboutCard
        title="Our Expertise"
        alt="White Pressure pipes for plumbing"
        imageSrc="/images-2.jpg"
        body="With years of experience in the industry, we specialize in a wide range of sizes and specifications to accommodate various requirements. Our team of skilled professionals works tirelessly to innovate and improve our manufacturing processes, ensuring that our customers receive the best products available on the market."
      />
    </div>
  )
}


function AboutCard({ imageSrc, title, alt, body, className = "" }) {
  return (
    <Card noPadding noGrid>
      <Card.title className="font-bold text-xl py-5 uppercase">{title}</Card.title>
      <Card.content className={"overflow-hidden" + className}>
        <Card.image
          imageProps={{
            src: imageSrc,
            className: "block w-full h-full object-cover",
            alt: alt
          }}
        />

        <Card.body className="py-5">{body}</Card.body>
      </Card.content>
    </Card>
  )
}