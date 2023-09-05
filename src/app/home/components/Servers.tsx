"use client";

import Image from "next/image";
import {
  faPlus,
  faArrowRightFromBracket,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function random() {
  return (
    <div className="bg-[#202225] w-[7.5%] h-[100%] flex flex-col items-center pt-[2.5%] pb-[2.5%] justify-between absolute z-[100]">
      <div className="flex flex-col items-center justify-center gap-[2.5vh]">
        <div className="bg-[#36393F] w-[5vw] h-[10vh] rounded-[100%] flex items-center justify-center">
          <div className="w-[90%] h-[90%] relative">
            <Image src="/assests/Login.svg" alt="login" fill={true} />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-[2.5vh]">
          <div className="bg-[#36393F] w-[4vw] h-[8vh] rounded-[100%] flex items-center justify-center">
            <FontAwesomeIcon
              icon={faPlus}
              className="text-[#43B581] w-[60%] h-[60%]"
            />
          </div>
        </div>
      </div>
      <div>
        <div className="flex flex-col items-center justify-center gap-[2.5vh]">
          <div className="bg-[#36393F] w-[4vw] h-[8vh] rounded-[100%] flex items-center justify-center">
            <div className="w-[80%] h-[80%] relative">
              <Image src="/assests/light-mode.svg" alt="login" fill={true} />
            </div>
          </div>
          <div className="bg-[#36393F] w-[4vw] h-[8vh] rounded-[100%] flex items-center justify-center">
            <FontAwesomeIcon
              icon={faArrowRightFromBracket}
              className="text-theme_red w-[60%] h-[60%]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
