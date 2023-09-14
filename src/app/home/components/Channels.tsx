"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Accordion, useAccordion } from "@/utils/Accordian";
import { Poppins } from "next/font/google";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faPlus,
  faSun,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Users from "./Users";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Modal from "./PopUpModal";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import NotificationGenerator from "@/components/ToastMessage";
import {
  addServers,
  selectServer,
  updateServer,
} from "@/redux/features/Servers";
import { HomeContext } from "@/contexts/HomeRealTimeContext";
import SearchUsersModal from "./SearchUsersModal";
import { useRouter } from "next/navigation";
const poppins = Poppins({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});
type AddFunction = (msg: { msg: string; title: string; type: string }) => void;

function AccordionItem({ children }: { children: any }) {
  return (
    <div className="rounded-[8px] overflow-hidden mb-[20px] bg-transparent">
      {children}
    </div>
  );
}

function AccordionHeader({
  title,
  icon,
}: {
  title: string;
  icon?: FontAwesomeIconProps;
}) {
  //@ts-ignore
  const { isActive, index, onChangeIndex } = useAccordion();

  return (
    <motion.div
      className={`p-[20px] cursor-pointer transition-colors ease-in-out  duration-150 ${
        isActive ? "bg-[#202225]" : "bg-transparent"
      }`}
      onClick={() => onChangeIndex(index)}
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <FontAwesomeIcon
            icon={!isActive ? faChevronDown : faChevronUp}
            className="text-[14px]"
          />
          <p className="text-white/70 text-[1vw]">{title}</p>
        </div>

        <div>
          <FontAwesomeIcon icon={faPlus} />
        </div>
      </div>
    </motion.div>
  );
}

function AccordionPanel({ children }) {
  //@ts-ignore
  const { isActive } = useAccordion();

  return (
    <AnimatePresence initial={false}>
      {isActive && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0 }}
        >
          <div className=" p-[20px] bg-[#4F545C] ">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const Channel = () => {
  const axiosWithAccessToken = useAxiosPrivate();
  const selectedServer = useAppSelector((state) => state.server.selectedServer);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);
  const [image, setImage] = useState(null);
  const errorRef = React.useRef(null);
  const Router = useRouter();
  const [users, setUsers] = useState([]);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isOpenOptions, setIsOpenOptions] = useState([]);
  const inputRef = React.useRef(null);
  const dispatch = useAppDispatch();
  const { socket } = useContext(HomeContext);
  const submitButtonRef = React.useRef(null);
  const selectImage = () => {
    inputRef.current.click();
  };
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("serverName", name);
      formData.append("serverDescription", description);
      formData.set("image", image);
      errorRef?.current?.({
        title: "We're Processing Your Request ⭐",
        msg: "Request is being processed please wait",
        type: "info",
      });
      //@ts-ignore
      submitButtonRef.current.disabled = true;
      //@ts-ignore
      submitButtonRef.current.style = "opacity:0.5;";
      const serverId = selectedServer && selectedServer.server._id;
      const response = await axiosWithAccessToken.patch(
        `/server/${serverId}`,
        formData
      );
      if (response.status === 200) {
        errorRef?.current?.({
          title: "Success ⭐",
          msg: "Server Updated Successfully",
          type: "success",
        });
        dispatch(updateServer(response.data.server));
        socket.emit("group-det-changed", {
          server: response.data.server,
          serverId: response.data.server._id,
        });
        closeModal();
      }
    } catch (error) {
      console.log(error);
      closeModal();
    }
  };
  useEffect(() => {
    if (!selectedServer) return;
    socket.emit("join-server", { serverId: selectedServer.server._id });
  }, [selectedServer]);

  useEffect(() => {
    socket.on("group-det-changed-update", ({ server }: { server: any }) => {
      if (
        selectedServer &&
        selectedServer.server &&
        selectedServer.server._id == server._id
      ) {
        let updatedServer = JSON.parse(JSON.stringify(selectedServer));
        updatedServer.server = server;
        dispatch(selectServer(updatedServer));

        errorRef?.current?.({
          title: "Group Details Updated ⭐",
          msg: "Group Details has been updated by the admin",
          type: "info",
        });
      }
    });
    socket.on("user-promoted-notify", ({ message, server }: any) => {
      if (selectedServer && selectedServer.server._id == server._id) {
        let updatedServer = JSON.parse(JSON.stringify(selectedServer));
        updatedServer.server = server;
        dispatch(selectServer(updatedServer));
        errorRef?.current?.(message);
      }
    });
    socket.on("user-added-notify", ({ message, server }: any) => {
      if (selectedServer && selectedServer.server._id == server._id) {
        let updatedServer = JSON.parse(JSON.stringify(selectedServer));
        updatedServer.server = server;
        dispatch(selectServer(updatedServer));
        errorRef?.current?.(message);
      }
    });

    return () => {
      socket.off("group-det-changed-update");
      socket.off("user-promoted-notify");
      socket.off("user-added-notify");
    };
  }, [socket, selectedServer]);

  useEffect(() => {
    setName(selectedServer && selectedServer.server.serverName);
    setDescription(selectedServer && selectedServer.server.serverDescription);
    setImageURL(selectedServer && selectedServer.server.serverProfilePhoto);
  }, [isModalOpen]);

  let letName =
    selectedServer && selectedServer.server
      ? selectedServer.server.serverName
      : "";
  const [imageURL, setImageURL] = useState(
    selectedServer && selectedServer.server
      ? selectedServer.server.serverProfilePhoto
      : null
  );
  const [name, setName] = useState(letName);
  const [description, setDescription] = useState(
    selectedServer && selectedServer.server
      ? selectedServer.server.serverDescription
      : ""
  );
  const { auth } = useAppSelector((state) => state.auth);

  const handlePromoteOrDemote = async (role: string, userId: string) => {
    console.log(userId);
    let roleObject = {};
    if (role == "Admin") {
      roleObject = {
        Admin: Math.floor(Math.random() * 1000) + 9000,
      };
    } else if (role == "Manager") {
      roleObject = {
        Manager: Math.floor(Math.random() * 1000) + 8000,
      };
    } else if (role == "Lead") {
      roleObject = {
        Lead: Math.floor(Math.random() * 1000) + 7000,
      };
    } else if (role == "User") {
      roleObject = {
        User: Math.floor(Math.random() * 1000) + 6000,
      };
    } else {
      roleObject = {
        Remove: Math.floor(Math.random() * 1000) + 5000,
      };
    }
    try {
      errorRef?.current?.({
        title: "We're Processing Your Request ⭐",
        msg: "We've send a request to the server to update the role",
        type: "info",
      });
      const response = await axiosWithAccessToken.post(
        `/server/${selectedServer.server._id}/promote-or-demote`,
        {
          userId,
          role: roleObject,
        }
      );
      if (response.status === 200) {
        errorRef?.current?.({
          title: response.data.title,
          msg: response.data.message,
          type: "success",
        });
        let Message = {
          title: response.data.title,
          msg: response.data.message,
          type: "info",
        };
        if (role != "Remove")
          socket.emit("user-promoted", {
            message: Message,
            serverId: selectedServer.server._id,
            server: response.data.server,
          });
        else {
          let Message = {
            title: response.data.title,
            msg: response.data.message,
            type: "error",
          };
          socket.emit("user-removed", {
            message: Message,
            removedUser: response.data.removedUser,
            serverId: selectedServer.server._id,
            server: response.data.server,
          });
          let updatedServer = JSON.parse(JSON.stringify(selectedServer));
          updatedServer.server = response.data.server;
          dispatch(selectServer(updatedServer));
          dispatch(updateServer(response.data.server));
        }
        if (role != "Remove") {
          let updatedServer = JSON.parse(JSON.stringify(selectedServer));
          console.log(response.data.server);
          updatedServer.server = response.data.server;
          console.log(updatedServer);
          dispatch(selectServer(updatedServer));
        }
      }
      console.log("== RESPONSE ==", response);
    } catch (error) {
      console.log(error);
      if (error.response)
        errorRef?.current?.({
          title: error.response.data.title,
          msg: error.response.data.message,
          type: "error",
        });
      else
        errorRef?.current?.({
          title: "Error 😢",
          msg: "Error while promoting or demoting user",
          type: "error",
        });
    }
  };
  let isAdmin =
    selectedServer &&
    selectedServer.server &&
    auth &&
    auth.user &&
    selectedServer.server.users.find((u) => {
      //@ts-ignore
      if (u.user._id == auth.user._id) {
        return u;
      }
    }) &&
    selectedServer.server.users.find((u) => {
      //@ts-ignore
      if (u.user._id == auth.user._id) {
        return u;
      }
    }).roleId &&
    (selectedServer.server.users.find((u) => {
      //@ts-ignore
      if (u.user._id == auth.user._id) {
        return u;
      }
    }).roleId.Admin > 9000 ||
      selectedServer.server.users.find((u) => {
        //@ts-ignore
        if (u.user._id == auth.user._id) {
          return u;
        }
      }).roleId.Manager > 8000);
  const [searchUserValue, setSearchUserValue] = useState("");
  const debounce = (func: any, timer: any) => {
    let timeout: any;
    return function (...args: any) {
      //@ts-ignore
      let context = this;
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, timer);
    };
  };
  const handleSearchUser = async (search: any) => {
    try {
      if (search.length > 0) {
        const response = await axiosWithAccessToken.get(
          `/auth/users?username=${search.toString()}`
        );
        if (response.status === 200) {
          setUsers(response.data.users);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const addToServer = async (userId: string) => {
    try {
      errorRef?.current?.({
        title: "We're Processing Your Request ⭐",
        msg: "We've send a request to the server to add the user",
        type: "info",
      });
      const response = await axiosWithAccessToken.post(
        `/server/${selectedServer.server._id}/`,
        {
          userId,
        }
      );
      console.log(response);
      if (response.status == 200) {
        let updatedServer = JSON.parse(JSON.stringify(selectedServer));
        updatedServer.server = response.data.server;
        console.log("== UPDTED SERVERS USERS ==", updatedServer.server.users);
        dispatch(selectServer(updatedServer));
        const message = {
          title: response.data.title,
          msg: response.data.message,
          type: "success",
        };
        socket.emit("user-added", {
          serverId: selectedServer.server._id,
          server: response.data.server,
          message,
        });

        socket.emit("in-app-updates", {
          serverId: selectedServer.server._id,
          servers: response.data.server,
          selectedServer: updatedServer,
          message: message,
        });
        errorRef?.current?.({
          title: response.data.title,
          msg: response.data.message,
          type: "success",
        });
      } else {
        errorRef?.current?.({
          title: response.data.title,
          msg: response.data.message,
          type: response.data.type || "success",
        });
      }
    } catch (error: any) {
      if (error.response)
        errorRef?.current?.({
          title: response.data.title,
          msg: response.data.message,
          type: Response.data.type,
        });
      else
        errorRef?.current?.({
          title: "Error 😢",
          msg: "Error while adding user to server",
          type: "error",
        });
    }
  };
  const debouncedFunction = useCallback(debounce(handleSearchUser, 500), []);
  return (
    <div
      className={`bg-[#2E3036] w-[30%] h-[100%] pt-[2.5%] pb-[2.5%] flex  flex-col text-blue-50 ${poppins.className} `}
    >
      <NotificationGenerator
        children={(add: AddFunction) => {
          //@ts-ignore
          errorRef.current = add;
        }}
      />
      <div className="p-4 border-black/20 border-b-[2px] flex justify-between items-center">
        <p className="text-gray-200">
          {(selectedServer &&
            selectedServer.server &&
            selectedServer.server.serverName) ||
            "CHANNEL NAME"}
        </p>
        {isAdmin && (
          <motion.button
            whileHover={{
              scale: 1.2,
              rotate: 90,
            }}
            whileTap={{
              scale: 0.9,
            }}
            onClick={() => setIsModalOpen((open) => !open)}
          >
            <FontAwesomeIcon icon={faSun} className="text-white/70" />
          </motion.button>
        )}
      </div>
      {selectedServer && selectedServer.server && (
        <Modal
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          description={description}
          handleSave={handleSave}
          imageURL={imageURL}
          inputRef={inputRef}
          name={name}
          selectImage={selectImage}
          setDescription={setDescription}
          setImage={setImage}
          setImageURL={setImageURL}
          setName={setName}
          submitButtonRef={submitButtonRef}
        />
      )}
      <SearchUsersModal
        isModalOpen={isAddUserModalOpen}
        setIsModalOpen={setIsAddUserModalOpen}
        handleChange={debouncedFunction}
        users={users}
        handleAddUser={addToServer}
        selectedServer={selectedServer}
        value={searchUserValue}
        setValue={setSearchUserValue}
      />
      <div>
        {selectedServer && selectedServer.server && (
          <Accordion multiple>
            {[
              {
                title: "TEXT CHANNELS",
                content: "TEXT CHANNEL",
              },

              { title: "AUDIO CHANNELS", content: "AUDIO CHANNEL" },

              {
                title: "VIDEO CHANNELS",
                content: "VIDEO CHANNEL",
              },
            ].map((_, i) => (
              <AccordionItem key={i}>
                <AccordionHeader title={_.title} />

                <AccordionPanel>{_.content}</AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        )}
        {/* Channel 1 */}
      </div>

      <div className="relative flex flex-col items-center justify-center ">
        <motion.div
          className={`p-[20px] cursor-pointer transition-colors ease-in-out  duration-150 w-[100%] mb-4 
     
      `}
        >
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <FontAwesomeIcon icon={faUser} className="text-[14px]" />
              <p className="text-white/70 text-[1vw]">{"PARTICIPANTS"}</p>
            </div>

            <motion.div
              onClick={() => {
                setIsAddUserModalOpen(true);
              }}
              whileHover={{
                scale: 1.2,
                rotate: 180,
              }}
              whileTap={{
                scale: 0.9,
              }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </motion.div>
          </div>
        </motion.div>
        <div className="flex flex-col gap-4 items-center justify-center w-[100%] ">
          {selectedServer &&
            selectedServer.server &&
            Users(
              selectedServer,
              isOpenOptions,
              setIsOpenOptions,
              handlePromoteOrDemote,
              auth.user._id,
              isAdmin
            )}
        </div>
      </div>
    </div>
  );
};

export default Channel;
