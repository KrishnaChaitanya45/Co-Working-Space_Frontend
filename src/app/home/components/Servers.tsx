"use client";
import React, { useState } from 'react';

import Image from "next/image";
import {
  faPlus,
  faArrowRightFromBracket,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function random() {
const[isModalOpen, setIsModalOpen] = useState(false);
const[name, setName] = useState('');
const[description, setDescription] = useState('');

const openModal = () => {
  setIsModalOpen (true);
}
const closeModal = () => {
  setIsModalOpen (false);
  setName('');
  setDescription('');
}
const handleSave = () => {
  
  closeModal();
}
 
  return (
    <div className="bg-[#202225] p-[1%] h-[100%] flex flex-col items-center pt-[2.5%] pb-[2.5%] justify-between  z-[100]">
      <div className="flex flex-col items-center justify-center gap-[2.5vh]">
        <div className="bg-[#36393F] w-[5vw] h-[10vh] rounded-[100%] flex items-center justify-center">
          <div className="w-[90%] h-[90%] relative">
            <Image src="/assests/Login.svg" alt="login" fill={true} />
          </div>
        </div>
   
        <motion.div
          className="flex flex-col items-center justify-center gap-[2.5vh]"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="bg-[#36393F] w-[4vw] h-[8vh] rounded-[100%] flex items-center justify-center" onClick={openModal}>
            <FontAwesomeIcon
            onClick={()=>{}}
              icon={faPlus}
              className="text-[#43B581] w-[60%] h-[60%]"
            />
          </div>
        </motion.div>
      </div>
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-white text-lg mb-2">Create Circle</h2>
            <input
              type="text"
              placeholder="Name"
              className="w-full bg-gray-700 rounded-md p-2 mb-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              className="w-full bg-gray-700 rounded-md p-2 mb-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="bg-[#43B581] text-white px-3 py-1 rounded-md mr-2"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="bg-[#EC1212] text-white px-3 py-1 rounded-md"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
     
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

function PopModal(){
  return <div className=""></div>

}