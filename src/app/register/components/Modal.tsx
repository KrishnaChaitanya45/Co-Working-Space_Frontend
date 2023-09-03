"use client";
import { Poppins, Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
const poppins = Poppins({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});
const montserrat = Montserrat({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});
export default function Modal() {
  const [open, setOpen] = useState(false);
  const [nextStep, setNextStep] = useState(1);
  return (
    <motion.div
      className=" w-[90%] md:w-[60%]   absolute rounded-lg p-10 flex flex-col backdrop-blur-md backdrop-brightness-100  bg-black/30"
      animate={{
        top: "12.5%",
        opacity: 1,
        left: nextStep === 1 ? "20%" : "-100%",
      }}
      initial={{ top: "0%", opacity: 0, left: "20%" }}
      transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
    >
      <div
        className={`flex flex-col items-center justify-center ${poppins.className} gap-4`}
      >
        <h1 className="text-white text-[26px] md:text-[32px] lg:text-[1.4vw] font-semibold">
          Create an account
        </h1>
      </div>
      <div className="w-[100%] flex mt-[1.5rem] items-center justify-between">
        <div className="w-[100%] xl:w-[60%]">
          <div
            className={` flex flex-col max-w-[100%] gap-2 ${poppins.className}`}
          >
            <label className="text-white/60 text-[14px] md:text-[16px] xl:text-[0.85vw] font-semibold ml-1">
              EMAIL
            </label>
            <input
              type="text"
              className="bg-theme_black p-[12px] xl:p-[0.5vw] rounded-md focus:outline-none focus:border-none text-white"
            />
          </div>
          <div
            className={`mt-4 flex flex-col max-w-[100%] gap-2 ${poppins.className}`}
          >
            <label className="text-white/60 text-[14px] md:text-[16px] xl:text-[0.85vw] font-semibold ml-1">
              DISPLAY NAME
            </label>
            <input
              type="text"
              className="bg-theme_black p-[12px] xl:p-[0.5vw] rounded-md focus:outline-none focus:border-none text-white"
              onClick={() => {
                setOpen(true);
              }}
            />
            <motion.p
              initial={{
                bottom: "-100%",
                opacity: 0,
                display: "none",
              }}
              animate={{
                bottom: open ? "0%" : "-100%",
                opacity: open ? 1 : 0,
                display: open ? "block" : "none",
              }}
              transition={{
                duration: 1,
                type: "spring",
                stiffness: 200,
              }}
            >
              This will be visible to every one
            </motion.p>
          </div>
          <div
            className={`mt-4 flex flex-col max-w-[100%] gap-2 ${poppins.className}`}
          >
            <label className="text-white/60 text-[14px] md:text-[16px] xl:text-[0.85vw] font-semibold ml-1">
              USERNAME
            </label>
            <input
              type="text"
              className="bg-theme_black p-[12px] xl:p-[0.5vw] rounded-md focus:outline-none focus:border-none text-white"
            />
          </div>
          <div
            className={`mt-4 flex flex-col max-w-[100%] gap-2 ${poppins.className}`}
          >
            <label className="text-white/60 text-[14px] md:text-[16px] xl:text-[0.85vw] font-semibold ml-1">
              PASSWORD
            </label>
            <input
              type="text"
              className="bg-theme_black p-[12px] xl:p-[0.5vw] rounded-md focus:outline-none focus:border-none text-white"
            />
          </div>
          <div
            className={`flex flex-col gap-2 max-w-[100%] mt-[1.5rem] ${montserrat.className}`}
          >
            <button
              className="w-[100%] bg-theme_purple p-[10px] md:p-[1vw] rounded-lg text-white font-medium text-[20px] xl:text-[1.25vw]"
              onClick={() => {
                setNextStep(2);
              }}
            >
              Next ➡️
            </button>
            <Link
              href="/register"
              className="ml-1 text-[14px] xl:text-[0.85vw] text-blue-300 font-semibold"
            >
              Already Have An Account?
            </Link>
          </div>
        </div>
        <div className="w-[30%] h-[80%]  items-center justify-center xl:flex hidden">
          <Image
            src="/assests/SignUp.svg"
            width={200}
            height={200}
            alt="MAN ICON"
            className="w-[100%] h-[100%]  mb-[25%] rotate-[45deg]"
          />
        </div>
      </div>
    </motion.div>
  );
}
