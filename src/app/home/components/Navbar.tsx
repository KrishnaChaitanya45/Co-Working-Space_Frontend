import { useAppSelector } from "@/redux/hooks";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React from "react";

function Navbar() {
  const auth = useAppSelector((state) => state.auth.auth);
  console.log(auth.user);
  return (
    <nav className="absolute w-[100%] h-[10vh]  top-0">
      <div className="flex items-center justify-between w-[90%] h-[100%] ml-[10%] pr-[2.5%]">
        <div>
          <h1 className="text-white">Channel Name</h1>
        </div>
        <div className="flex gap-4 items-center mt-4">
          <div className="bg-[#202225] w-[3.5vw] h-[7vh] rounded-[100%] flex items-center justify-center">
            <FontAwesomeIcon
              icon={faBell}
              className="text-white/60 w-[60%] h-[60%]"
            />
          </div>
          <div className="bg-[#36393F] w-[5vw] h-[10vh] rounded-[100%] flex items-center justify-center">
            <img
              src={auth.user ? auth.user.profilePhoto : "/assests/Login.svg"}
              alt="login"
              className="w-[80%] h-[80%] rounded-[100%]"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
