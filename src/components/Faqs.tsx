
import React, { useState } from "react";
import Collapse from "@mui/material/Collapse";
import Card from "@/components/Card"
import { IoClose } from "react-icons/io5";
import { useAutoAnimate } from '@formkit/auto-animate/react'




const faqs = [
  { question: "What types of pipes do you manufacture?", answer: "We manufacture plumbing pipes and electrical conduit pipes for various applications." },
  { question: "Where are you located?", answer: "At NO.16 Kilometer 10 Orlu-Ihiala road, Awo-Idemili, Imo state." },
  { question: "What materials are used for your pipes?", answer: "Our pipes are made from high-quality PVC, Calcium, and other durable materials." },
  { question: "Do you offer custom pipe designs?", answer: "Yes, we provide custom designs to meet unique client requirements." },
  { question: "Are your pipes environmentally friendly?", answer: "Yes, our pipes are designed to be recyclable and environmentally sustainable." },
  {
    question: "Do you provide delivery services?",
    answer: "Yes, we offer delivery services within Southern Nigeria and selected nearby states close to the South-Eastern Nigeria."
  },
  { question: "How can I place a bulk order?", answer: "You can contact us via email or phone to discuss bulk order requirements." },
  { question: "Do you provide installation support?", answer: "We offer consultancy services for installation to ensure proper usage." },
  { question: "What sizes of pipes do you manufacture?", answer: "We produce pipes ranging from 20mm to 160mm in diameter." },
  { question: "Are your pipes resistant to chemicals?", answer: "Yes, our pipes are chemically resistant and suitable for industrial use." },
  { question: "Do you offer wholesale pricing for distributors?", answer: "Absolutely! We provide competitive wholesale pricing for bulk purchases." },
  { question: "What is the maximum temperature your pipes can withstand?", answer: "Our pipes can handle temperatures up to 60°C." },
  { question: "Do you produce pipes for industrial use?", answer: "Yes, we manufacture pipes for both residential and industrial applications." },
  { question: "Can your pipes be used for underground installations?", answer: "Yes, our pipes are designed to withstand underground conditions." }
];



export default function FAQs() {
  const [expanded, setExpanded] = useState(false);
  const [showAll, setShowAll] = useState(false)
  const [animatingBoxRef, enableBoxAnimation] = useAutoAnimate()
  const handleExpand = (key) => {
    setExpanded((prev) => (prev === key ? false : key));
  };
  return (<>
    <div
      ref={animatingBoxRef}
      className="max-w-4xl mx-auto py-5 divide-y divide-black/20"
    >
      {faqs.slice(0, showAll ? undefined : 4).map((faq) => {
        const key = faq.question
        return (
          <div
            key={key}
            className="py-5"
          >
            <div
              onClick={() => handleExpand(key)}
              className="flex justify-between items-center gap-5"
            >
              <h2 className="font-semibold text-lg leading-5">{faq.question}</h2>
              <span className="text-3xl">
                {
                  <IoClose
                    className={`${expanded === key ? "rotate-[0deg]" : "rotate-[-45deg]"} transition text-[20px]`}
                  />
                }
              </span>
            </div>
            <Collapse in={expanded === key} unmountOnExit={false}>
              <p className="block mt-4 px-3">{faq.answer}</p>
            </Collapse>
          </div>
        )
      })
      }
    </div>
    <button className="mt-7 border-[.5px] font-[500] border-white/50 py-1 px-5 rounded-md bg-transparent" onClick={() => setShowAll(x => !x)}>
      {showAll ? "Show Less" : "Show All"}
    </button>
  </>);
};