"se client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
const Users = (
  selectedServer: any,
  isOpenOptions: any,
  setIsOpenOptions: any,
  handlePromoteOrDemote: (role: string, userId: string) => void,
  auth: any,
  isAdmin: any
) => {
  console.log(isOpenOptions);
  return (
    selectedServer &&
    selectedServer.server &&
    selectedServer.server.users &&
    selectedServer.server.users.map((user: any, index: number) => (
      <div
        className={`flex items-center justify-between p-2 w-[90%] rounded-[12px]  ${
          Object.keys(selectedServer.server.users[index].roleId)[0] == "Admin"
            ? "bg-theme_blue/70"
            : Object.keys(selectedServer.server.users[index].roleId)[0] ==
              "Manager"
            ? "bg-theme_purple/70"
            : Object.keys(selectedServer.server.users[index].roleId)[0] ==
              "Lead"
            ? "bg-theme_yellow/60"
            : "bg-transparent"
        }`}
        key={user.user._id}
      >
        <div className="flex items-center gap-4">
          <div className="bg-[#202225] w-[3vw] h-[6vh] rounded-[100%] flex items-center justify-center">
            <img
              src={user.user.profilePhoto}
              alt="login"
              className="w-[90%] h-[90%] rounded-[100%]"
            />
          </div>
          <p className="text-white/70 ">{user.user.displayname}</p>
        </div>
        <div className=" bg-theme_gray p-2 rounded-md relative">
          <p
            className="text-white/70 cursor-pointer"
            onClick={() => {
              if (isAdmin) {
                if (
                  isOpenOptions.find(
                    (i: number) =>
                      i ==
                      Object.values(
                        selectedServer.server.users[index].roleId
                      )[0]
                  )
                ) {
                  setIsOpenOptions(
                    isOpenOptions.filter(
                      (i: number) =>
                        i !=
                        Object.values(
                          selectedServer.server.users[index].roleId
                        )[0]
                    )
                  );
                } else {
                  setIsOpenOptions([
                    ...isOpenOptions,
                    Object.values(selectedServer.server.users[index].roleId)[0],
                  ]);
                }
              }
            }}
          >
            {Object.keys(selectedServer.server.users[index].roleId)[0]}
          </p>
          <AnimatePresence initial={false}>
            {Boolean(
              isOpenOptions.find(
                (i: number) =>
                  i ==
                  Object.values(selectedServer.server.users[index].roleId)[0]
              ) &&
                //@ts-ignore
                Object.values(selectedServer.server.users[index].roleId)[0] <
                  9000 &&
                selectedServer.server.users[index].user._id != auth
            ) && (
              <motion.div
                className="flex flex-col justify-center items-center right-[150%] top-[-100%] absolute  bg-black rounded-md shadow-md"
                initial={{
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.5,
                }}
              >
                <p
                  className="hover:bg-theme_blue/70 w-[100%] p-4 cursor-pointer text-center"
                  onClick={() => {
                    //@ts-ignore
                    handlePromoteOrDemote(
                      "Admin",
                      selectedServer.server.users[index].user._id
                    );
                  }}
                >
                  Admin
                </p>
                <p
                  className="hover:bg-theme_purple/70 w-[100%] p-4 cursor-pointer text-center"
                  onClick={() => {
                    //@ts-ignore
                    handlePromoteOrDemote(
                      "Manager",
                      selectedServer.server.users[index].user._id
                    );
                  }}
                >
                  Manager
                </p>
                <p
                  className="hover:bg-theme_yellow/70 w-[100%] p-4 cursor-pointer text-center"
                  onClick={() => {
                    handlePromoteOrDemote(
                      "Lead",
                      selectedServer.server.users[index].user._id
                    );
                  }}
                >
                  Lead
                </p>
                <p
                  className="hover:bg-theme_gray w-[100%] p-4 cursor-pointer text-center"
                  onClick={() => {
                    handlePromoteOrDemote(
                      "User",
                      selectedServer.server.users[index].user._id
                    );
                  }}
                >
                  User
                </p>
                <p
                  className="hover:bg-theme_gray w-[100%] p-4 cursor-pointer bg-theme_red text-center"
                  onClick={() => {
                    handlePromoteOrDemote(
                      "Remove",
                      selectedServer.server.users[index].user._id
                    );
                  }}
                >
                  Remove
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    ))
  );
};

export default Users;
