import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, AnimatePresence } from "framer-motion";
import { Poppins, Montserrat } from "next/font/google";
const poppins = Poppins({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});
const Input = ({
  validValue,
  valueRef,
  setValue,
  value,
  propName,
  setValueFocus,
  checkNeeded,
  isPassword,
  valueFocus,
  valueMessage,
  displayNeeded,
  nextValueRef,
  isConfirmPasswordEqualsPassword,
}: {
  validValue?: boolean;
  valueRef?: any;
  propName: string;
  setValue: any;
  value: string;
  setValueFocus: any;
  isPassword?: boolean;
  checkNeeded: boolean;
  valueFocus: boolean;
  valueMessage: string;
  displayNeeded?: boolean;
  nextValueRef?: any;
  isConfirmPasswordEqualsPassword?: boolean;
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  return (
    <div
      className={`mt-4 flex flex-col max-w-[100%] gap-2 ${poppins.className}`}
    >
      <div className="flex items-center gap-4">
        <label className="text-white/60 text-[14px] md:text-[16px] xl:text-[0.85vw] font-semibold ml-1">
          {propName}
        </label>
        {checkNeeded != undefined && checkNeeded == true && (
          <span
            className={
              (
                validValue == undefined
                  ? value.length > 5 &&
                    isConfirmPasswordEqualsPassword != undefined &&
                    isConfirmPasswordEqualsPassword
                  : validValue
              )
                ? "text-[24px] text-green-600"
                : "hidden"
            }
          >
            <FontAwesomeIcon icon={faCheck} />
          </span>
        )}
      </div>
      <div className="relative w-[100%]">
        <input
          type={isPassword ? (passwordVisible ? "text" : "password") : "text"}
          className="bg-theme_black p-[12px] xl:p-[1vw] rounded-md focus:outline-none focus:border-none text-white w-[100%]"
          ref={valueRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          required
          aria-invalid={validValue ? "false" : "true"}
          aria-describedby="Value-error"
          onFocus={() => setValueFocus(true)}
          onBlur={() => setValueFocus(false)}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute right-[5%] top-[27.5%] text-[20px] text-white/60"
            onClick={() => {
              setPasswordVisible(!passwordVisible);
            }}
          >
            <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
          </button>
        )}
      </div>
      {valueFocus &&
        value &&
        (validValue != undefined
          ? !validValue
          : !isConfirmPasswordEqualsPassword) && (
          <motion.p
            className="text-white bg-black/70 p-2 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={
              valueFocus &&
              value &&
              (validValue == undefined ? true : !validValue)
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: -10 }
            }
            transition={{ duration: 0.5 }}
            id="Value-error"
          >
            {isPassword &&
            displayNeeded != undefined &&
            displayNeeded != false ? (
              <>
                <br />
                <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                must be at least 8 characters long
                <br />
                <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                Must begin with a letter <br />
                <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                Letters, numbers, and underscores only <br />
                <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                At least one number and one special character Letters, numbers,
                and underscores only <br />
                <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                At least one uppercase
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                {valueMessage}
              </>
            )}
          </motion.p>
        )}
    </div>
  );
};

export default Input;
