"use client";
import { Poppins, Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { axiosPrivate } from "@/api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, AnimatePresence } from "framer-motion";
import {
  useState,
  useRef,
  useEffect,
  FormEvent,
  MutableRefObject,
} from "react";
import { USER_REGEX, EMAIL_REGEX, PASSWORD_REGEX } from "@/utils/userRegex";
import Input from "@/components/Input";
import NotificationGenerator from "@/components/ToastMessage";
import axios, { AxiosError } from "axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setAuth } from "@/redux/features/Auth";

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
  const dispatch = useAppDispatch();
  const router = useRouter();
  const auth = useAppSelector((state) => state.auth.auth);
  console.log(auth);
  const userRef = useRef(null);
  const errorRef = useRef<null | AddFunction>(null);

  const [password, setPassword] = useState("");
  const [passwordFocus, setPasswordFocus] = useState(false);
  const searchParams = useParams();

  const [validPassword, setValidPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);
  const [confirmValidPassword, setConfirmValidPassword] = useState(false);

  const [open, setOpen] = useState(false);

  const [nextStep, setNextStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let isMobile = navigator.userAgent.includes("Mobile");
    if (isMobile) {
      setIsMobile(true);
    }
    //@ts-ignore
    userRef?.current?.focus();
  }, []);

  useEffect(() => {
    const result = PASSWORD_REGEX.test(password);
    setValidPassword(result);
  }, [password]);
  useEffect(() => {
    const result = EMAIL_REGEX.test(confirmPassword);
    setConfirmValidPassword(result);
  }, [confirmPassword]);
  useEffect(() => {
    setErrorMessage("");
  }, [confirmPassword, password]);
  useEffect(() => {
    console.log(auth);
    // if (searchParams.id == auth.user.id) {
    //   console.log(true);
    // } else {
    //   console.log(false);
    // }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v1 = PASSWORD_REGEX.test(confirmPassword);
    const v2 = PASSWORD_REGEX.test(password);

    if (!v2) {
      //@ts-ignore

      errorRef?.current?.({
        msg: "Invalid Password",
        title: "Invalid Password",
        type: "error",
      });
      return;
    }
    if (!v1) {
      //@ts-ignore
      userRef?.current?.focus();
      errorRef?.current?.({
        msg: "Invalid Confirm Password",
        title: "Invalid Confirm Password",
        type: "error",
      });
      return;
    }

    errorRef?.current?.({
      title: "Request sent to your servers..!✅",
      msg: "Please wait while we create your account..! 🔥",
      type: "info",
    });
    // try {
    //   const response = await axiosPrivate.post(
    //     "/auth/register",
    //     {
    //       username,
    //       displayname: displayName,
    //       email,
    //       password,
    //     },
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    //   if (response.status == 201) {
    //     errorRef?.current?.({
    //       title: "Account Created ✅ , Verification Pending ⭐",
    //       msg: "Your account has been created successfully 😄, we've sent you a verification code to your mail...!",
    //       type: "success",
    //     });
    //     const accessToken = response.data.tokens.accessToken;
    //     const user = response.data.user;
    //     dispatch(setAuth({ accessToken, user }));
    //   }
    //   setNextStep(2);
    // } catch (error: any) {
    //   console.log(error.response.status);
    //   if (error.response.status == 409)
    //     errorRef?.current?.({
    //       title: "User Already Exists",
    //       msg: "username or email you entered is already taken 😄",
    //       type: "error",
    //     });
    // }
  };
  const passwordsMatch = password == confirmPassword;
  console.log(passwordsMatch && validPassword);
  return (
    <>
      <div>
        <NotificationGenerator
          children={(add: AddFunction) => {
            errorRef.current = add;
          }}
        />
      </div>
      <motion.section
        className=" w-[90%] md:w-[60%]   absolute rounded-lg p-10 flex flex-col backdrop-blur-md backdrop-brightness-100  bg-black/30"
        animate={{
          top: "12.5%",
          opacity: 1,
          left: nextStep === 1 ? (isMobile ? "5%" : "20%") : "-100%",
        }}
        initial={{ top: "0%", opacity: 0, left: "20%" }}
        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
      >
        <div aria-live="assertive" ref={errorRef}></div>
        <div
          className={`flex flex-col items-center justify-center ${poppins.className} gap-4`}
        >
          <h1 className="text-white text-[26px] md:text-[32px] lg:text-[1.4vw] font-semibold">
            Hello {auth?.user?.username} ! Reset your password here..!
          </h1>
        </div>
        <div className="w-[100%] flex mt-[1.5rem] items-center justify-between">
          <form onSubmit={handleSubmit} className="w-[100%] xl:w-[60%]">
            <Input
              setValue={setPassword}
              value={password}
              propName="PASSWORD"
              setValueFocus={setPasswordFocus}
              validValue={validPassword}
              isPassword={true}
              valueFocus={passwordFocus}
              valueMessage=""
              displayNeeded={true}
            />
            <Input
              setValue={setConfirmPassword}
              value={confirmPassword}
              propName="CONFIRM PASSWORD"
              setValueFocus={setConfirmPasswordFocus}
              isPassword={true}
              isConfirmPasswordEqualsPassword={password == confirmPassword}
              valueFocus={confirmPasswordFocus}
              valueMessage="Password Doesn't Match 😕"
            />

            <div
              className={`flex flex-col gap-2 max-w-[100%] mt-[1.5rem] ${montserrat.className}`}
            >
              <button
                type="submit"
                disabled={validPassword && passwordsMatch ? true : false}
                className={`w-[100%] bg-theme_purple p-[10px] md:p-[1vw] rounded-lg text-white font-medium text-[20px] xl:text-[1.25vw] ${
                  validPassword && passwordsMatch ? "opacity-100" : "opacity-50"
                }`}
              >
                Change Password
              </button>
            </div>
          </form>
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
      </motion.section>
    </>
  );
}
