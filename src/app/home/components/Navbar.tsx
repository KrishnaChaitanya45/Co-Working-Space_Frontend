import { useAppSelector } from "@/redux/hooks";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React from "react";

function Navbar() {
  const auth = useAppSelector((state) => state.auth.auth);

  return (
    <nav className=" w-[100%] h-[10vh]  top-0">
      <div className="flex items-center justify-between w-[90%] h-[100%] ml-[10%] pr-[2.5%]">
        <div>{/* <h1 className="text-white">Channel Name</h1> */}</div>
        <div className="flex gap-4 items-center mt-4">
          <div className="bg-[#202225] w-[4vw] h-[8vh] rounded-[100%] flex items-center justify-center">
            <FontAwesomeIcon
              icon={faBell}
              className="text-theme_yellow w-[50%] h-[50%]"
            />
          </div>
          <div className="bg-[#202225] w-[4vw] h-[8vh] rounded-[100%] flex items-center justify-center">
            <img
              src={auth.user ? auth.user.profilePhoto : "/assests/Login.svg"}
              alt="login"
              className="w-[90%] h-[90%] rounded-[100%]"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
