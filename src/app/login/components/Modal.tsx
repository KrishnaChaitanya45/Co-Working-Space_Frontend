"use client";
import { Poppins, Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  return (
    <motion.div
      className=" w-[90%] md:w-[60%]  xl:h-[60%] absolute rounded-lg p-10 flex flex-col backdrop-blur-md backdrop-brightness-100  bg-black/30"
      animate={{
        top: "20%",
        opacity: 1,
      }}
      initial={{ top: "0%", opacity: 0 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
    >
      <div
        className={`flex flex-col items-center justify-center ${poppins.className} gap-4`}
      >
        <h1 className="text-white text-[26px] md:text-[32px] lg:text-[1.4vw] font-semibold">
          Welcome Back
        </h1>
        <p
          className={`text-white/60 ${montserrat.className} text-[14px] md:text-[20px] lg:text-[1vw]`}
        >
          We're so excited to see you again..!
        </p>
      </div>
      <div className="w-[100%] flex mt-[1.5rem] items-center justify-between">
        <div className="w-[100%] xl:w-[60%]">
          <div
            className={` flex flex-col max-w-[100%] gap-2 ${poppins.className}`}
          >
            <label className="text-white/60 text-[14px] md:text-[16px] xl:text-[0.85vw] font-semibold ml-1">
              EMAIL or USERNAME
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
            <Link
              href="/"
              className="ml-1 text-[14px] xl:text-[0.85vw] text-[#03A0EF] font-semibold"
            >
              Forgot your password ?
            </Link>
          </div>
          <div
            className={`flex flex-col gap-2 max-w-[100%] mt-[1.5rem] ${montserrat.className}`}
          >
            <button className="w-[100%] bg-theme_purple p-[10px] md:p-[1vw] rounded-lg text-white font-medium text-[20px] xl:text-[1vw]">
              Log In
            </button>
            <Link
              href="/register"
              className="ml-1 text-[14px] xl:text-[0.85vw] text-blue-300 font-semibold"
            >
              Need an account ?
            </Link>
          </div>
        </div>
        <div className="w-[30%] h-[80%]  items-center justify-center xl:flex hidden">
          <Image
            src="/assests/Login.svg"
            width={200}
            height={200}
            alt="MAN ICON"
            className="w-[100%] h-[100%]  mb-[25%]"
          />
        </div>
      </div>
    </motion.div>
  );
}
