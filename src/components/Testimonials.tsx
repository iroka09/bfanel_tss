
import { Swiper, SwiperSlide } from "swiper/react"
import {
  Autoplay,
  Pagination,
  //Navigation,
  // EffectCube,
  EffectCoverflow
} from "swiper/modules"
import Card from "@/components/Card"
import { FaQuoteLeft } from "react-icons/fa";
import { cn } from "@/lib/utils"



type dataType = Array<{
  name: string;
  message: string;
  avatar: string;
  alt: string;
}>;

const testimonials: dataType = [
  {
    name: "Anonymous",
    message:
      "We’ve been sourcing conduit pipes from B-Fanel for months now and the durability is impressive. Installation has been smooth and we’ve had zero complaints from our technicians.",
    avatar: "/empty_male.jpg",
    alt: "empty male anonymous",
  },
  {
    name: "Anonymous",
    message:
      "Their plumbing pipes are consistent in quality and sizing. For our building projects, reliability of supply is critical and B-Fanel has delivered every time.",
    avatar: "/empty_female.jpg",
    alt: "empty female anonymous",
  },
  {
    name: "Anonymous",
    message:
      "Customer service was responsive and professional. Orders were processed quickly and the delivery timeline was accurate. It’s good working with a manufacturer that understands deadlines.",
    avatar: "/empty_male.jpg",
    alt: "empty male anonymous",
  },
  {
    name: "Anonymous",
    message:
      "We tested several pipe suppliers before settling on B-Fanel. Their products showed better strength and finishing compared to others in the market.",
    avatar: "/empty_female.jpg",
    alt: "empty female anonymous",
  },
  {
    name: "Anonymous",
    message:
      "Our electrical installations require dependable conduit pipes, and B-Fanel has met that standard. The consistency across batches makes planning easier for our team.",
    avatar: "/empty_male.jpg",
    alt: "empty male anonymous",
  },
  {
    name: "Anonymous",
    message:
      "The materials used are clearly high-grade. Even after long-term use in demanding environments, the pipes maintain their structure without cracking or fading.",
    avatar: "/empty_male.jpg",
    alt: "empty male anonymous",
  },
  {
    name: "Anonymous",
    message:
      "What stands out is their professionalism and packaging. Products arrive clean, well-bundled, and ready for deployment on site without additional sorting.",
    avatar: "/empty_female.jpg",
    alt: "empty female anonymous",
  }
];


export default function TestimonialCarousel() {
  return (
    <div className="container">
      <h1 className="section-title text-primary mb-10 uppercase">What Our Clients Say</h1>
      <Swiper
        modules={[
          Autoplay,
          Pagination,
          //Navigation,
          //EffectCube, 
          EffectCoverflow,
        ]}
        speed={400}
        //  navigation={true}
        spaceBetween={20}
        autoHeight
        //slidesPerView={1}
        autoplay={{ delay: 4000 }}
        pagination={{ clickable: true }}
        loop
        className="mySwiper"
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        /*  
        effect={'cube'}
           grabCursor={true}
           cubeEffect={{
             shadow: true,
             slideShadows: true,
             shadowOffset: 20,
             shadowScale: 0.94,
           }}
           */
        effect={'coverflow'}
        centeredSlides={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 45,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
      >
        {testimonials.map((item, i) => (
          <SwiperSlide key={i}>
            <Card
              className="bg-white dark:bg-white/5 pt-3 pb-[80px] md:pb-2"
              noPadding
              disableAnimation
              author={"Saco of user_id=" + i}
            >
              <Card.Content className="mt-4 px-3 pb-3">
                <Card.Body className="mt-4 px-3 pb-3">
                  <p className="text-md">
                    <FaQuoteLeft className="inline-block text-4xl align-text-bottom mr-2" />
                    <span className="">
                      {item.message}
                    </span>
                  </p>
                  <div className="mt-4 text-sm italic font-semibold">
                    ~ {item.name}
                  </div>
                </Card.Body>
                <Card.Image
                  className={cn(
                    "w-full h-[250px] relative",
                    item.name.toLowerCase() === "anonymous" && "dark:opacity-50"
                  )}
                  imageProps={{
                    src: item.avatar,
                    className: "object-cover h-full w-full",
                    alt: item.name + " avatar"
                  }}
                />
              </Card.Content>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}