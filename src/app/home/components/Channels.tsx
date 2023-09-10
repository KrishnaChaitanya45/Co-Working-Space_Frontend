"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Accordion, useAccordion } from "@/utils/Accordian";
import { Poppins } from "next/font/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faPlus,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Modal from "./PopUpModal";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import NotificationGenerator from "@/components/ToastMessage";
import { updateServer } from "@/redux/features/Servers";
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

function AccordionHeader({ title }: { title: string }) {
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
          <div className=" p-[20px] bg-[#4F545C]">{children}</div>
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

  console.log(selectedServer);
  const errorRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const dispatch = useAppDispatch();
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
        closeModal();
      }
      closeModal();
    } catch (error) {
      console.log(error);
      closeModal();
    }
  };
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
  return (
    <div
      className={`bg-[#2E3036] w-[30%] h-[100%] pt-[2.5%] pb-[2.5%] flex  flex-col text-blue-50 ${poppins.className}`}
    >
      <NotificationGenerator
        children={(add: AddFunction) => {
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
      {/* Channel 1 */}
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
    </div>
  );
};

export default Channel;
