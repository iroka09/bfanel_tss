"use client"

import React, { useState } from "react";
import _Collapse from "react-collapse"
const {Collapse}=_Collapse
import Card from "@/components/Card"
import { IoClose } from "react-icons/io5";



const faqs = [
  { question: "What types of pipes do you manufacture?", answer: "We manufacture plumbing pipes and electrical conduit pipes for various applications." },
  { question: "Where are you located?", answer: "At NO.16 Kilometer 10 Orlu-Ihiala road, Awo-Idemili, Imo state." },
  { question: "What materials are used for your pipes?", answer: "Our pipes are made from high-quality PVC, Calcium, and other durable materials." },
  { question: "Do you offer custom pipe designs?", answer: "Yes, we provide custom designs to meet unique client requirements." },
  { question: "Are your pipes environmentally friendly?", answer: "Yes, our pipes are designed to be recyclable and environmentally sustainable." },
  { question: "Do you provide delivery services?", answer: "Yes, we offer delivery services across Nigeria." },
  { question: "How can I place a bulk order?", answer: "You can contact us via email or phone to discuss bulk order requirements." },
  { question: "Do you provide installation support?", answer: "We offer consultancy services for installation to ensure proper usage." },
  { question: "What sizes of pipes do you manufacture?", answer: "We produce pipes ranging from 20mm to 160mm in diameter." },
  { question: "Are your pipes resistant to chemicals?", answer: "Yes, our pipes are chemically resistant and suitable for industrial use." },
  { question: "Do you offer wholesale pricing for distributors?", answer: "Absolutely! We provide competitive wholesale pricing for bulk purchases." },
  { question: "What is the maximum temperature your pipes can withstand?", answer: "Our pipes can handle temperatures up to 60°C." },
  { question: "Can I visit your factory for product inspection?", answer: "Yes, factory visits are welcome. Kindly schedule an appointment in advance." },
  { question: "How long does delivery take?", answer: "Delivery usually takes 3-7 business days depending on the location." },
  { question: "Do you produce pipes for industrial use?", answer: "Yes, we manufacture pipes for both residential and industrial applications." },
  { question: "What is your refund policy?", answer: "Refunds are processed within 7 days for unused products in original condition." },
  { question: "Can your pipes be used for underground installations?", answer: "Yes, our pipes are designed to withstand underground conditions." },
  { question: "Do you offer technical support for your products?", answer: "Yes, we provide full technical support for all our products." },
];



export default function FAQs() {
  const [expanded, setExpanded] = useState(false);
  const [showAll, setShowAll] = useState(false)
  const handleExpand = (key) => {
    setExpanded((prev) => (prev === key ? false : key));
  };
  return (<>
    <div className="max-w-4xl mx-auto py-5 divide-y divide-black/30">
      {faqs.slice(0, showAll ? undefined : 4).map((faq) => {
        const key = faq.question
        return (
          <div
            key={key}
            className="text-primary py-5"
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
            <Collapse isOpened={expanded === key} >
              <p className="block mt-4 px-3">{faq.answer}</p>
            </Collapse>
          </div>
        )
      })
      }
    </div>
    <button className="mt-7 text-primary border-[.5px] font-[500] border-primary py-1 px-5 rounded-md bg-transparent" onClick={() => setShowAll(x => !x)}>
      {showAll ? "Show Less" : "Show All"}
    </button>
  </>);
};