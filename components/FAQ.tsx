import { faqItems } from "@/app/constants/services";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
const FAQ = () => {
  return (
    <div className="bg-[#06102c] text-white rounded-t-4xl py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <Accordion className="w-full">
          {faqItems.map((item) => (
            <AccordionItem key={item.id} value={item.question} className="py-3">
              <AccordionTrigger className="text-left hover:no-underline md:text-xl">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-300">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};
export default FAQ;
