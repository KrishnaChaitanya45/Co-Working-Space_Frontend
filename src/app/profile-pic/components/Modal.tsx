"use client";
import { Poppins, Montserrat } from "next/font/google";
import Image from "next/image";
import { useState, useRef, useEffect, FormEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Input from "@/components/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { axiosPrivate } from "@/api/axios";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import NotificationGenerator from "@/components/ToastMessage";
import { setAuth } from "@/redux/features/Auth";
import useRefreshToken from "@/hooks/useRefreshToken";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
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
type AddFunction = (msg: { msg: string; title: string; type: string }) => void;
export default function Modal() {
  const userRef = useRef(null);
  const errRef = useRef(null);
  const axiosWithAccessToken = useAxiosPrivate();

  const auth = useAppSelector((state) => state.auth.auth);
  const refresh = useRefreshToken();

  console.log("== AUTH ==", auth);

  const errorRef = useRef(null);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [imageURL, setImageURL] = useState(null);
  const [image, setImage] = useState(null);
  const isMobile = navigator.userAgent.match("Mobile");
  const inputRef = useRef(null);
  const selectImage = async (e: FormEvent<HTMLFormElement>) => {
    // e.preventDefault();
    inputRef?.current.click();
  };
  const handleProfilePicUpload = async () => {
    try {
      errorRef?.current?.({
        msg: "We've sent a request to our servers to update your profile picture..!",
        title: "Profile Update Request Sent ⭐",
        type: "info",
      });
      const formData = new FormData();
      const profileImage = {
        uri: imageURL,
        type: image.type,
        name: `${auth.user?.name}'s-profile-picture.jpg}`,
      };
      console.log(profileImage);
      formData.set("image", image);
      console.log(formData);
      const response = await axiosWithAccessToken.patch(
        "/user/profile-photo",
        formData
      );
      console.log(response);

      errorRef?.current?.({
        msg: response.data.message,
        title: response.data.title,
        type: "success",
      });
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: any) {
      console.log(error);
      errorRef?.current?.({
        msg: error.message,
        title: "Error",
        type: "error",
      });
    }
  };
  return (
    <>
      <div>
        <NotificationGenerator
          children={(add: AddFunction) => {
            errorRef.current = add;
          }}
        />
      </div>
      <motion.div
        className=" w-[90%] md:w-[60%]  xl:h-[60%] absolute rounded-lg p-10 flex flex-col backdrop-blur-md backdrop-brightness-100  bg-black/30"
        animate={{
          top: "20%",
          opacity: 1,
          left: isMobile ? "5%" : "20%",
        }}
        initial={{ top: "0%", opacity: 0 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
      >
        <div aria-live="assertive" ref={errRef}></div>
        <div
          className={`flex flex-col items-center justify-center ${poppins.className} gap-4`}
        >
          <h1 className="text-white text-[26px] md:text-[32px] lg:text-[1.4vw] font-semibold">
            Hey ..! {auth.user?.username}
          </h1>
          <p
            className={`text-white/60 ${montserrat.className} text-[14px] md:text-[20px] lg:text-[1vw]`}
          >
            Set your profile picture here..! ( try to add an image without
            background 😉)
          </p>
        </div>
        <div className="w-[100%] flex flex-col mt-[2rem] items-center justify-between">
          <div
            className="w-[15vw] h-[30vh] bg-[#D8F3F7]/50 rounded-[100%] flex items-center justify-center cursor-pointer"
            onClick={selectImage}
          >
            {!imageURL ? (
              <FontAwesomeIcon
                icon={faCamera}
                className="text-white text-[5vw]"
              />
            ) : (
              <img
                src={imageURL}
                className="w-[15vw] h-[30vh] rounded-[100%] shadow-[#000_0px_50px_100px_-12px] object-cover"
              />
            )}
            <input
              type="file"
              id="file"
              ref={inputRef}
              onChange={(e) => {
                if (!e.target.files[0]) return;
                const image = e.target.files[0];
                setImage(image);
                const imageURL = URL.createObjectURL(image);
                setImageURL(imageURL);
              }}
              style={{ display: "none" }}
            />
          </div>
          <div
            className={`flex flex-col gap-2 max-w-[100%] mt-[2rem] ${montserrat.className}`}
          >
            <button
              className="w-[30vw] bg-theme_purple p-[10px] md:p-[1vw] rounded-lg text-white font-medium text-[20px] xl:text-[1vw]"
              onClick={handleProfilePicUpload}
            >
              Set As Profile Picture
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
