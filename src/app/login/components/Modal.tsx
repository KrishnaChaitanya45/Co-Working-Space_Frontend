"use client";
import { Poppins, Montserrat } from "next/font/google";
import Image from "next/image";
import { useState, useRef, useEffect, FormEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import { axiosPrivate } from "@/api/axios";
import { PASSWORD_REGEX } from "@/utils/userRegex";
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
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [validUsernameOrEmail, setValidUsernameOrEmail] = useState(false);
  const [usernameOrEmailFocus, setUsernameOrEmailFocus] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [success, setSuccess] = useState(false);
  const [nextStep, setNextStep] = useState(1);
  useEffect(() => {
    //@ts-ignore
    userRef?.current?.focus();
  }, []);
  useEffect(() => {
    //@ts-ignore
    setErrorMessage("");
  }, [usernameOrEmail, password]);
  const auth = useAppSelector((state) => state.auth.auth);
  const refresh = useRefreshToken();
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
        ref.onkeydown = (e) => handleKeyDown(e, index);
      }
    }
  };
  const errorRef = useRef(null);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const isMobile = navigator.userAgent.match("Mobile");
  const handleVerify = async () => {
    try {
      errorRef?.current?.({
        title: "Verifying your account..!",
        msg: "Please wait while we verify your account..!",
        type: "info",
      });

      if (userId) {
        const response = await axiosWithAccessToken.post(
          "/auth/otp/verify",
          {
            otp: Number(otp.join("")),
            usernameOrEmail: usernameOrEmail,
            forResetPassword: true,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        errorRef?.current?.({
          title: response.data.title,
          msg: response.data.message,
          type: "success",
        });

        setTimeout(() => {
          router.push(`/reset-password/${userId}`);
        }, 2000);
      }
    } catch (error: any) {
      console.log(error);
      errorRef?.current?.({
        title: error.response.data.title,
        msg: error.response.data.message,
        type: "error",
      });
    }
  };
  useEffect(() => {
    if (usernameOrEmail.length > 3) {
      setValidUsernameOrEmail(true);
    }
  }, [usernameOrEmail]);
  useEffect(() => {
    const result = PASSWORD_REGEX.test(password);
    setValidPassword(result);
  }, [password]);
  const handleResend = async () => {
    try {
      if (usernameOrEmail.length < 1) {
        errorRef?.current?.({
          title: "Username or Email is required..!",
          msg: "Please enter a valid username or email for us to send the email to..!",
          type: "error",
        });
        return;
      }
      errorRef?.current?.({
        title: "Finding You ..!🔍",
        msg: "Please wait while we find you and send you an OTP ..!",
        type: "info",
      });
      const response = await axiosWithAccessToken.post("/auth/otp/resend", {
        usernameOrEmail: usernameOrEmail,
        forResetPassword: true,
      });
      errorRef?.current?.({
        title: response.data.title,
        msg: response.data.message,
        type: "success",
      });
      console.log("== AUTH DATA ==", response.data);
      dispatch(
        setAuth({
          user: response.data.user,
          accessToken: "",
        })
      );
      setUserId(response.data.user._id);
      setNextStep(2);
    } catch (error: any) {
      console.log(error);
      errorRef?.current?.({
        title: error.response.data.title,
        msg: error.response.data.message,
        type: "error",
      });
    }
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.preventDefault();
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

    errorRef?.current?.({
      title: "Request sent to your servers..!✅",
      msg: "Please wait while we create your account..! 🔥",
      type: "info",
    });
    try {
      const response = await axiosPrivate.post(
        "/auth/login",
        {
          emailOrUsername: usernameOrEmail,
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
          title: "Login Successful ✅ ",
          msg: "Your have logged in  successfully 😄, redirecting to the homepage",
          type: "success",
        });
        const accessToken = response.data.tokens.accessToken;
        const user = response.data.user;
        dispatch(setAuth({ accessToken, user }));
      }
      setTimeout(() => {
        router.push("/home");
      }, 2000);
    } catch (error: any) {
      console.log(error);
      console.log(error.response.status);
      if (error.response.status == 401)
        errorRef?.current?.({
          title: "Invalid Credentials Provided",
          msg: "Please check your credentials and try again..!",
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
          left: nextStep === 1 ? (isMobile ? "5%" : "20%") : "-100%",
        }}
        initial={{ top: "0%", opacity: 0 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
      >
        <div aria-live="assertive" ref={errRef}></div>
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
          <form className="w-[100%] xl:w-[60%]" onSubmit={handleSubmit}>
            <Input
              propName="EMAIL or USERNAME"
              setValue={setUsernameOrEmail}
              setValueFocus={setUsernameOrEmailFocus}
              value={usernameOrEmail}
              valueFocus={usernameOrEmailFocus}
              valueMessage="Enter Your Registered Email or Username"
              validValue={validUsernameOrEmail}
              valueRef={userRef}
              checkNeeded={false}
            />
            <Input
              propName="PASSWORD"
              setValue={setPassword}
              setValueFocus={setPasswordFocus}
              value={password}
              valueFocus={passwordFocus}
              valueMessage="Enter Your Password Here...!"
              validValue={validPassword}
              isPassword={true}
              displayNeeded={false}
              checkNeeded={false}
            />
            <button
              className="ml-1 text-[14px] xl:text-[0.85vw] text-blue-300 font-semibold"
              onClick={handleResend}
            >
              Forgot Your Password ?
            </button>
            <div
              className={`flex flex-col gap-2 max-w-[100%] mt-[1.5rem] ${montserrat.className}`}
            >
              <button
                disabled={validUsernameOrEmail && validPassword ? false : true}
                className={`w-[100%] bg-theme_purple p-[10px] md:p-[1vw] rounded-lg text-white font-medium text-[20px] xl:text-[1vw] ${
                  validUsernameOrEmail && validPassword
                    ? "opacity-100"
                    : "opacity-50"
                }`}
                type="submit"
              >
                Log In
              </button>
              <Link
                href="/register"
                className="ml-1 text-[14px] xl:text-[0.85vw] text-blue-300 font-semibold"
              >
                Need an account ?
              </Link>
            </div>
          </form>
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
      <motion.section
        className={`${
          nextStep == 2 ? "flex" : "hidden"
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
              OTP Verification
            </h1>
            <p className="max-w-[70%] text-[16px] xl:text-[0.9vw] text-white/60 text-center">
              We've sent a verification code to you email address..! It'll
              expire within one hour so hurry up..!🙌
            </p>
          </div>
          <div className="flex items-center mt-8 gap-4">
            <input
              type="text"
              value={otp[0].toString()}
              ref={(ref) => addInputRef(ref, 0)}
              onChange={(e) => handleInputChange(e, 0)}
              maxLength={1}
              className="w-[40px] xl:w-[2.5vw] h-[7.5vh] focus:border-theme_purple border-[5px] focus:outline-none text-[1.5vw] p-3 backdrop-blur-lg backdrop-brightness-200  bg-white/60"
            />
            <input
              type="text"
              value={otp[1].toString()}
              ref={(ref) => addInputRef(ref, 1)}
              onChange={(e) => handleInputChange(e, 1)}
              maxLength={1}
              className="w-[40px] xl:w-[2.5vw] h-[7.5vh] focus:border-theme_purple border-[5px] focus:outline-none text-[1.5vw] p-3 backdrop-blur-lg backdrop-brightness-200  bg-white/60"
            />
            <input
              type="text"
              value={otp[2].toString()}
              ref={(ref) => addInputRef(ref, 2)}
              onChange={(e) => handleInputChange(e, 2)}
              maxLength={1}
              className="w-[40px] xl:w-[2.5vw] h-[7.5vh] focus:border-theme_purple border-[5px] focus:outline-none text-[1.2vw] p-3 backdrop-blur-lg backdrop-brightness-200  bg-white/60"
            />
            <input
              type="text"
              value={otp[3].toString()}
              ref={(ref) => addInputRef(ref, 3)}
              onChange={(e) => handleInputChange(e, 3)}
              maxLength={1}
              className="w-[40px] xl:w-[2.5vw] h-[7.5vh] focus:border-theme_purple border-[5px] focus:outline-none text-[1.5vw] p-3 backdrop-blur-lg backdrop-brightness-200  bg-white/60"
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
