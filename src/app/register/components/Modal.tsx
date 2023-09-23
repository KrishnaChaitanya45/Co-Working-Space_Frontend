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
import { useRouter } from "next/navigation";
import { useAppDispatch, AppSelector } from "@/redux/hooks";
import { setAuth } from "@/redux/features/Auth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { getNavigator } from "@/app/login/components/Modal";

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
  const auth = AppSelector((state) => state.auth.auth) as any;
  console.log(auth);
  const userRef = useRef(null);
  const errorRef = useRef<null | AddFunction>(null);

  const [username, setUsername] = useState("");
  const [usernameFocus, setUsernameFocus] = useState(false);
  const [validUsername, setValidUsername] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [displayNameFocus, setDisplayNameFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [emailFocus, setEmailFocus] = useState(false);
  const [validEmail, setValidEmail] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [validPassword, setValidPassword] = useState(false);

  const [open, setOpen] = useState(false);
  const axiosWithAccessToken = useAxiosPrivate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [nextStep, setNextStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const navigator = getNavigator() as any;
    let isMobile = navigator.userAgent.includes("Mobile");
    if (isMobile) {
      setIsMobile(true);
    }
    //@ts-ignore
    userRef?.current?.focus();
  }, []);
  useEffect(() => {
    const result = USER_REGEX.test(username);
    setValidUsername(result);
  }, [username]);
  useEffect(() => {
    const result = PASSWORD_REGEX.test(password);
    setValidPassword(result);
  }, [password]);
  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result);
  }, [email]);
  useEffect(() => {
    setErrorMessage("");
  }, [username, displayName, email, password]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(username);
    const v2 = PASSWORD_REGEX.test(password);
    const v3 = EMAIL_REGEX.test(email);
    if (!v1) {
      //@ts-ignore

      errorRef?.current?.({
        msg: "Invalid Username",
        title: "Invalid Username",
        type: "error",
      });
      return;
    }
    if (!v2) {
      //@ts-ignore

      errorRef?.current?.({
        msg: "Invalid Password",
        title: "Invalid Password",
        type: "error",
      });
      return;
    }
    if (!v3) {
      //@ts-ignore
      userRef?.current?.focus();
      errorRef?.current?.({
        msg: "Invalid Email",
        title: "Invalid Email",
        type: "error",
      });
      return;
    }
    if (!displayName) {
      //@ts-ignore
      errorRef?.current?.({
        title: "Display name is invalid",
        msg: "Invalid Display Name",
      });
    }
    errorRef?.current?.({
      title: "Request sent to your servers..!✅",
      msg: "Please wait while we create your account..! 🔥",
      type: "info",
    });
    try {
      const response = await axiosPrivate.post(
        "/auth/register",
        {
          username,
          displayname: displayName,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.status == 201) {
        errorRef?.current?.({
          title: "Account Created ✅ , Verification Pending ⭐",
          msg: "Your account has been created successfully 😄, we've sent you a verification code to your mail...!",
          type: "success",
        });
        const accessToken = response.data.tokens.accessToken;
        const user = response.data.user;
        dispatch(setAuth({ accessToken, user }));
      }
      setNextStep(2);
    } catch (error: any) {
      console.log(error);
      console.log(error.response.status);
      if (error.response.status == 409)
        errorRef?.current?.({
          title: "User Already Exists",
          msg: "username or email you entered is already taken 😄",
          type: "error",
        });
    }
    // setNextStep(2);
  };

  const handleKeyDown = (e: any, index: number) => {
    if (e.key === "Enter") {
      const nextIndex = index + 1;
      if (nextIndex < inputRefs.current.length) {
        inputRefs.current[nextIndex].focus();
      } else {
        inputRefs.current[0].focus(); // Focus on the first input field
      }
    }
  };
  const handleInputChange = (e: any, index: number) => {
    // Handle your input change logic here
    e.preventDefault();
    setIsError(false);
    console.log(e.target.value);
    const val = e?.target?.value;
    console.log(val);
    if (isNaN(val)) {
      return;
    }
    console.log(val.length);
    if (val.length < 1) {
      const otpCopy = [...otp];
      otpCopy[index] = "";
      console.log(otpCopy);
      setOtp(otpCopy);
    } else {
      const otpCopy = [...otp];
      otpCopy[index] = val;
      console.log(otpCopy);
      setOtp(otpCopy);
    }
    console.log("REACHED HERE");
    handleKeyDown({ key: "Enter" }, index);
    // otpCopy[index] = val;
    // console.log(otpCopy);
    // setOtp(otpCopy);
  };
  console.log("== AUTH ==", auth);
  const inputRefs = useRef<any>([]);
  const addInputRef = (ref: any, index: number) => {
    if (ref && !inputRefs.current.includes(ref)) {
      inputRefs.current.push(ref);
      if (index === inputRefs.current.length - 1) {
        ref.onkeydown = (e: any) => handleKeyDown(e, index);
      }
    }
  };

  const handleVerify = async () => {
    try {
      errorRef?.current?.({
        title: "Verifying your account..!",
        msg: "Please wait while we verify your account..!",
        type: "info",
      });
      const response = await axiosWithAccessToken.post(
        "/auth/otp/verify",
        {
          otp: Number(otp.join("")),
          userId: auth.user.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setIsError(false);
      errorRef?.current?.({
        title: response.data.title,
        msg: response.data.message,
        type: "success",
      });
      setTimeout(() => {
        router.push("/profile-pic");
      }, 2000);
    } catch (error: any) {
      console.log(error);
      setIsError(true);
      setOtp(["", "", "", ""]);
      errorRef?.current?.({
        title: error.response.data.title,
        msg: error.response.data.message,
        type: "error",
      });
    }
  };

  const handleResend = async () => {
    try {
      errorRef?.current?.({
        title: "Sending OTP..!",
        msg: "Please wait while we send you a new OTP..!",
        type: "info",
      });
      const response = await axiosPrivate.post("/auth/otp/resend", {
        userId: auth.user.id,
      });
      errorRef?.current?.({
        title: response.data.title,
        msg: response.data.message,
        type: "success",
      });
    } catch (error: any) {
      console.log(error);
      errorRef?.current?.({
        title: error.response.data.title,
        msg: error.response.data.message,
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
        <div
          aria-live="assertive"
          // @ts-ignore
          ref={errorRef}
        ></div>
        <div
          className={`flex flex-col items-center justify-center ${poppins.className} gap-4`}
        >
          <h1 className="text-white text-[26px] md:text-[32px] lg:text-[1.4vw] font-semibold">
            Create an account
          </h1>
        </div>
        <div className="w-[100%] flex mt-[1.5rem] items-center justify-between">
          <form onSubmit={handleSubmit} className="w-[100%] xl:w-[60%]">
            <Input
              setValue={setEmail}
              value={email}
              propName="EMAIL"
              setValueFocus={setEmailFocus}
              validValue={validEmail}
              valueFocus={emailFocus}
              valueMessage="We'll never share your Value with anyone else 🙅‍♂️. It's a promise😅"
              valueRef={userRef}
              nextValueRef={displayNameFocus}
            />
            <Input
              setValue={setDisplayName}
              value={displayName}
              propName="DISPLAY NAME"
              setValueFocus={setDisplayNameFocus}
              valueFocus={displayNameFocus}
              valueMessage=" This is how other's see you, make sure you sound unique 😉"
              nextValueRef={usernameFocus}
            />
            <Input
              setValue={setUsername}
              value={username}
              propName="USER NAME"
              setValueFocus={setUsernameFocus}
              validValue={validUsername}
              valueFocus={usernameFocus}
              valueMessage="This is how we refer you..!, make sure you sound unique to
              identify😄"
              nextValueRef={passwordFocus}
            />

            <Input
              setValue={setPassword}
              value={password}
              propName="PASSWORD"
              setValueFocus={setPasswordFocus}
              validValue={validPassword}
              isPassword={true}
              valueFocus={passwordFocus}
              valueMessage="This is how we refer you..!, make sure you sound unique to
              identify😄"
              displayNeeded={true}
              nextValueRef={emailFocus}
            />

            <div
              className={`flex flex-col gap-2 max-w-[100%] mt-[1.5rem] ${montserrat.className}`}
            >
              <button
                type="submit"
                disabled={
                  !validEmail ||
                  !validPassword ||
                  !validUsername ||
                  !displayName
                    ? true
                    : false
                }
                className={`w-[100%] bg-theme_purple p-[10px] md:p-[1vw] rounded-lg text-white font-medium text-[20px] xl:text-[1.25vw] ${
                  !validEmail ||
                  !validPassword ||
                  !validUsername ||
                  !displayName
                    ? "opacity-50"
                    : "opacity-100"
                }`}
              >
                Next ➡️
              </button>
              <Link
                href="/login"
                className="ml-1 text-[14px] xl:text-[0.85vw] text-blue-300 font-semibold"
              >
                Already Have An Account?
              </Link>
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
      <motion.section
        className={`${
          nextStep == 2 ? "flex" : "none"
        } w-[90%] md:w-[60%] absolute rounded-lg p-10 flex flex-col backdrop-blur-md backdrop-brightness-100  bg-black/30 ${
          poppins.className
        }`}
        animate={{
          opacity: 1,
          top: "12.5%",
          left: nextStep === 2 ? (isMobile ? "5%" : "20%") : "100%",
        }}
        initial={{ opacity: 0, left: "100%%", top: "0%" }}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-[25vw] h-[25vh] relative">
            <Image src="/assests/email.svg" fill={true} alt="Email Icon" />
          </div>
          <div className="translate-y-[1rem] flex flex-col gap-4 items-center justify-center">
            <h1 className="xl:text-[1.35vw] text-[24px] text-white">
              Verify Your Account
            </h1>
            <p className="max-w-[70%] text-[16px] xl:text-[0.9vw] text-white/60 text-center">
              We've sent a verification code to you email address..! It'll
              expire within one hour so hurry up..!🙌
            </p>
          </div>
          <div className="flex items-center mt-8 gap-4">
            <motion.input
              type="text"
              value={otp[0].toString()}
              ref={(ref) => addInputRef(ref, 0)}
              onChange={(e) => handleInputChange(e, 0)}
              maxLength={1}
              animate={{
                translateX: isError
                  ? [-10, 0, 10, -10, 0, 10, 0]
                  : [0, 0, 0, 0, 0, 0, 0],
              }}
              //@ts-ignore
              initial={{
                translateX: [0, 0, 0, 0, 0, 0, 0],
              }}
              transition={{
                duration: 0.5,
                stiffness: 100,
                type: "spring",
              }}
              className={`w-[40px] xl:w-[3.0vw] h-[7.5vh] focus:border-theme_purple border-[5px] focus:outline-none text-[1.5vw] p-3 backdrop-blur-lg backdrop-brightness-200  bg-white/60 ${
                isError ? "border-theme_red" : "border-white"
              }`}
            />
            <motion.input
              type="text"
              value={otp[1].toString()}
              ref={(ref) => addInputRef(ref, 1)}
              onChange={(e) => handleInputChange(e, 1)}
              maxLength={1}
              animate={{
                translateX: isError
                  ? [-10, 0, 10, -10, 0, 10, 0]
                  : [0, 0, 0, 0, 0, 0, 0],
              }}
              //@ts-ignore
              initial={{
                translateX: [0, 0, 0, 0, 0, 0, 0],
              }}
              transition={{
                duration: 0.5,
                stiffness: 100,
                type: "spring",
              }}
              className={`w-[40px] xl:w-[3.0vw] h-[7.5vh] focus:border-theme_purple border-[5px] focus:outline-none text-[1.5vw] p-3 backdrop-blur-lg backdrop-brightness-200  bg-white/60 ${
                isError ? "border-theme_red" : "border-white"
              }`}
            />
            <motion.input
              type="text"
              value={otp[2].toString()}
              ref={(ref) => addInputRef(ref, 2)}
              onChange={(e) => handleInputChange(e, 2)}
              maxLength={1}
              animate={{
                translateX: isError
                  ? [-10, 0, 10, -10, 0, 10, 0]
                  : [0, 0, 0, 0, 0, 0, 0],
              }}
              //@ts-ignore
              initial={{
                translateX: [0, 0, 0, 0, 0, 0, 0],
              }}
              transition={{
                duration: 0.5,
                stiffness: 100,
                type: "spring",
              }}
              className={`w-[40px] xl:w-[3.0vw] h-[7.5vh] focus:border-theme_purple border-[5px] focus:outline-none text-[1.5vw] p-3 backdrop-blur-lg backdrop-brightness-200  bg-white/60 ${
                isError ? "border-theme_red" : "border-white"
              }`}
            />
            <motion.input
              type="text"
              value={otp[3].toString()}
              ref={(ref) => addInputRef(ref, 3)}
              onChange={(e) => handleInputChange(e, 3)}
              maxLength={1}
              animate={{
                translateX: isError
                  ? [-10, 0, 10, -10, 0, 10, 0]
                  : [0, 0, 0, 0, 0, 0, 0],
              }}
              //@ts-ignore
              initial={{
                translateX: [0, 0, 0, 0, 0, 0, 0],
              }}
              transition={{
                duration: 0.5,
                stiffness: 100,
                type: "spring",
              }}
              className={`w-[40px] xl:w-[3.0vw] h-[7.5vh] focus:border-theme_purple border-[5px] focus:outline-none text-[1.5vw] p-3 backdrop-blur-lg backdrop-brightness-200  bg-white/60 ${
                isError ? "border-theme_red" : "border-white"
              }`}
            />
          </div>
          <button
            type="submit"
            disabled={otp[3].length < 1 ? true : false}
            className={`mt-8 w-[60%] bg-theme_purple p-[10px] md:p-[1vw] rounded-lg text-white font-medium text-[20px] xl:text-[1.25vw] ${
              otp[3].length < 1 ? "opacity-50" : "opacity-100"
            }`}
            onClick={handleVerify}
          >
            Verify 🚀
          </button>
          <button
            className="self-start ml-[20%] text-[14px] xl:text-[1vw] text-white bg-theme_gray p-4 rounded-lg "
            onClick={handleResend}
          >
            Resend
          </button>
        </div>
      </motion.section>
    </>
  );
}
