import { AnimatePresence } from "framer-motion";
import React from "react";
import { motion } from "framer-motion";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function Modal({
  isModalOpen,
  closeModal,
  selectImage,
  inputRef,
  imageURL,
  setImage,
  setImageURL,
  name,
  setName,
  description,
  setDescription,
  handleSave,
  submitButtonRef,
}: {
  isModalOpen: boolean;
  closeModal: () => void;
  selectImage: () => void;
  inputRef: any;
  imageURL: any;
  setImage: any;
  setImageURL: any;
  name: any;
  setName: any;
  description: any;
  setDescription: any;
  handleSave: any;
  submitButtonRef: any;
}) {
  return (
    <AnimatePresence initial={false}>
      {isModalOpen && (
        <motion.div
          className="fixed  z-[10] top-0 left-0 w-full h-full flex items-center justify-center"
          initial={{
            opacity: 0,
            top: "-100%",
          }}
          animate={{
            opacity: 1,
            top: 0,
          }}
          transition={{
            duration: 0.3,
            type: "spring",
            stiffness: 200,
          }}
          exit={{
            opacity: 0,
            top: "-100%",
          }}
        >
          <div className="bg-gray-800 p-10 gap-4 rounded-lg flex items-center justify-center flex-col ">
            <h2 className="text-white text-lg mb-2">Choose Here</h2>
            <div
              className="w-[15vw] h-[30vh] bg-[#D8F3F7]/50 rounded-[100%] flex items-center justify-center cursor-pointer"
              onClick={selectImage}
            >
              {!imageURL ? (
                <div className="flex flex-col gap-4 items-center justify-center">
                  <FontAwesomeIcon
                    icon={faCamera}
                    className="text-white text-[5vw]"
                  />
                  <p className="text-white mb-2">Upload here</p>
                </div>
              ) : (
                <>
                  <img
                    src={imageURL}
                    className="w-[15vw] h-[30vh] rounded-[100%] shadow-[#000_0px_50px_100px_-12px] object-cover"
                  />
                </>
              )}
              <input
                type="file"
                id="file"
                ref={inputRef}
                onChange={(e: any) => {
                  if (!e.target.files[0]) return;
                  const image = e.target.files[0];
                  setImage(image);
                  const imageURL = URL.createObjectURL(image);
                  setImageURL(imageURL);
                }}
                style={{ display: "none" }}
              />
            </div>
            <input
              type="text"
              placeholder="Name"
              className="w-[30vw] bg-gray-700 rounded-md p-2 mb-2 text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              placeholder="Description"
              rows={3}
              draggable={false}
              className="w-[30vw] bg-gray-700 rounded-md p-2 mb-2 text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                ref={submitButtonRef}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
