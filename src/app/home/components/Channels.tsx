import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Accordion, useAccordion } from "@/utils/Accordian";
import { Poppins } from "next/font/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faPlus,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
const poppins = Poppins({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});
function AccordionItem({ children }: { children: any }) {
  return (
    <div className="rounded-[8px] overflow-hidden mb-[20px] bg-transparent">
      {children}
    </div>
  );
}

function AccordionHeader({ title }: { title: string }) {
  const { isActive, index, onChangeIndex } = useAccordion();

  return (
    <motion.div
      className={`p-[20px] cursor-pointer transition-colors ease-in-out  duration-150 ${
        isActive ? "bg-[#202225]" : "bg-transparent"
      }`}
      onClick={() => onChangeIndex(index)}
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <FontAwesomeIcon
            icon={!isActive ? faChevronDown : faChevronUp}
            className="text-[14px]"
          />
          <p className="text-white/70 text-[1vw]">{title}</p>
        </div>
        <div>
          <FontAwesomeIcon icon={faPlus} />
        </div>
      </div>
    </motion.div>
  );
}

function AccordionPanel({ children }) {
  const { isActive } = useAccordion();

  return (
    <AnimatePresence initial={false}>
      {isActive && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0 }}
        >
          <div className=" p-[20px] bg-[#4F545C]">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const Channel = () => {
  return (
    <div
      className={`bg-[#2E3036] w-[30%] h-[100%] pt-[2.5%] pb-[2.5%] flex  flex-col text-blue-50 ${poppins.className}`}
    >
      <div className="p-4 border-black/20 border-b-[2px] flex justify-between items-center">
        <p className="text-gray-200">CHANNEL NAME</p>
        <FontAwesomeIcon icon={faSun} className="text-white/70" />
      </div>

      {/* Channel 1 */}
      <Accordion multiple>
        {[
          {
            title: "TEXT CHANNELS",
            content: "TEXT CHANNEL",
          },

          { title: "AUDIO CHANNELS", content: "AUDIO CHANNEL" },

          {
            title: "VIDEO CHANNELS",
            content: "VIDEO CHANNEL",
          },
        ].map((_, i) => (
          <AccordionItem key={i}>
            <AccordionHeader title={_.title} />

            <AccordionPanel>{_.content}</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Channel;
