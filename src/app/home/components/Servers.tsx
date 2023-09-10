"use client";
import React, { FormEvent, useEffect, useRef, useState } from "react";

import Image from "next/image";
import {
  faPlus,
  faArrowRightFromBracket,
  faSun,
  faCamera,
  faArrowDown,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import NotificationGenerator from "@/components/ToastMessage";
import { faArrowAltCircleDown } from "@fortawesome/free-regular-svg-icons";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addServers,
  deselectServer,
  selectServer,
} from "@/redux/features/Servers";
import Modal from "./PopUpModal";
type AddFunction = (msg: { msg: string; title: string; type: string }) => void;
export default function random() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const [image, setImage] = useState(null);
  const { selectedServer, servers } = useAppSelector((state) => state.server);
  const dispatch = useAppDispatch();
  const inputRef = useRef(null);
  const [name, setName] = useState("");
  const [serverSelected, setServerSelected] = useState(null);
  const [description, setDescription] = useState("");
  const axiosWithAccessToken = useAxiosPrivate();
  const submitButtonRef = useRef(null);
  const [serversFetched, setServers] = useState(servers);
  const [moreVisible, setMoreVisible] = useState(false);
  async function getServers() {
    try {
      const response = await axiosWithAccessToken.get("/server");
      if (response.status == 200) {
        dispatch(addServers(response.data.servers));
        setServers(response.data.servers);
        if (!serverSelected) {
          setServerSelected(response.data.servers[0]);
          dispatch(selectServer(response.data.servers[0]));
        }
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getServers();
  }, [isModalOpen]);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setName("");
    setDescription("");
  };
  const errorRef = useRef(null);
  const handleSave = async () => {
    //@ts-ignore
    try {
      const formData = new FormData();
      if (!name || !description) {
        //@ts-ignore
        errorRef?.current?.({
          title: "Invalid Input",
          msg: "Please fill all the fields",
          type: "error",
        });
        setTimeout(() => {
          closeModal();
        }, 2000);
        return;
      }
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
      const response = await axiosWithAccessToken.post("/server", formData);
      if (response.status == 200) {
        setName("");
        setDescription("");
        setImage(null);
        setImageURL(null);
        errorRef?.current?.({
          title: "Successfully Created ⭐",
          msg: "Server created successfully",
          type: "success",
        });
      }
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (error) {
      console.log(error);
      closeModal();
    }
  };
  const selectImage = async (e: FormEvent<HTMLFormElement>) => {
    // e.preventDefault();
    inputRef?.current.click();
  };
  return (
    <div className="bg-[#202225] p-[1%] h-[100%] flex flex-col items-center pt-[2.5%] pb-[2.5%] justify-between  z-[100] ">
      <NotificationGenerator
        children={(add: AddFunction) => {
          errorRef.current = add;
        }}
      />
      <div className="flex flex-col items-center justify-center gap-[2.5vh] ">
        <div className="bg-[#36393F] w-[4vw] h-[8vh] rounded-[100%] flex items-center justify-center shrink-0">
          <div className="w-[90%] h-[90%] relative">
            <Image src="/assests/Login.svg" alt="login" fill={true} />
          </div>
        </div>
        {serversFetched &&
          serversFetched.length > 0 &&
          serversFetched.slice(0, 3).map((server: any) => {
            let url = "/assests/Login.svg";
            if (server.server) url = server.server.serverProfilePhoto;
            console.log(url);
            return (
              <motion.div
                className={`bg-[#36393F] w-[5vw] h-[10vh] rounded-[100%] flex items-center justify-center shrink-0 border-4 ${
                  serverSelected
                    ? serverSelected.server._id == server.server._id
                      ? "opacity-100 border-theme_purple"
                      : "opacity-50 border-transparent"
                    : "opacity-50 border-transparent"
                }`}
                key={server.server._id}
                animate={{
                  scale: serverSelected == server ? 1.1 : 1,
                  transition: {
                    duration: 0.3,
                  },
                }}
                whileHover={{
                  scale: 1.1,
                }}
                whileTap={{
                  scale: 0.9,
                }}
                onClick={() => {
                  setServerSelected(server);
                  dispatch(selectServer(server));
                }}
              >
                <div className="w-[100%] h-[100%] relative rounded-[100%]">
                  <Image
                    src={url}
                    alt="login"
                    fill={true}
                    className="rounded-[100%]"
                  />
                </div>
              </motion.div>
            );
          })}
        {moreVisible &&
          serversFetched &&
          serversFetched.length > 3 &&
          serversFetched
            .slice(3, serversFetched.length - 1)
            .map((server: any) => {
              let url = "/assests/Login.svg";
              if (server.server) url = server.server.serverProfilePhoto;
              return (
                <motion.div
                  className={`bg-[#36393F] w-[5vw] h-[10vh] rounded-[100%] flex items-center justify-center shrink-0 border-5 ${
                    serverSelected
                      ? "opacity-100 border-white"
                      : "opacity-50 border-transparent"
                  }`}
                  initial={{}}
                  animate={{
                    scale: serverSelected == server ? 1.1 : 1,
                    transition: {
                      duration: 0.3,
                    },
                  }}
                  whileHover={{
                    scale: 1.1,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                  onClick={() => {
                    if (serverSelected == server) {
                      setServerSelected(null);
                      return;
                    }
                    setServerSelected(server);
                  }}
                >
                  <div className="w-[100%] h-[100%] relative rounded-[100%]">
                    <Image
                      src={url}
                      alt="login"
                      fill={true}
                      objectFit="cover"
                      className="rounded-[100%]"
                    />
                  </div>
                </motion.div>
              );
            })}
        {serversFetched && serversFetched.length > 3 && (
          <div
            className=" w-[4vw] h-[8vh] flex items-center justify-center shrink-0"
            onClick={() => {
              setMoreVisible(!moreVisible);
            }}
          >
            <FontAwesomeIcon
              icon={faChevronDown}
              className="text-white/60 text-[1.5vw]"
            />
          </div>
        )}
        <motion.div
          className="flex flex-col items-center justify-center gap-[2.5vh]"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div
            className="bg-[#36393F] w-[4vw] h-[8vh] rounded-[100%] flex items-center justify-center"
            onClick={openModal}
          >
            <FontAwesomeIcon
              onClick={() => {}}
              icon={faPlus}
              className="text-[#43B581] w-[60%] h-[60%]"
            />
          </div>
        </motion.div>
      </div>
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
      <div>
        <div className="flex flex-col items-center justify-center gap-[2.5vh]">
          <motion.div
            className="bg-[#36393F] w-[3.5vw] h-[7.5vh] rounded-[100%] flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="w-[60%] h-[60%] relative">
              <Image src="/assests/light-mode.svg" alt="login" fill={true} />
            </div>
          </motion.div>
          <motion.div
            className="bg-[#36393F] w-[3.5vw] h-[7.5vh] rounded-[100%] flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FontAwesomeIcon
              icon={faArrowRightFromBracket}
              className="text-theme_red w-[50%] h-[50%]"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function PopModal() {
  return <div className=""></div>;
}
