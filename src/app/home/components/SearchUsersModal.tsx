"use client";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
export default function SearchUsersModal({
  isModalOpen,
  setIsModalOpen,
  handleChange,
  value,
  users,
  setValue,
  selectedServer,
  handleAddUser,
}: {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleChange: any;
  value: any;
  users: any;
  selectedServer: any;
  handleAddUser: any;
  setValue: any;
}) {
  const closeModal = () => {
    setIsModalOpen(false);
  };
  function checkUser(userId: any) {
    let userExits = Boolean(
      selectedServer &&
        selectedServer.server &&
        selectedServer.server.users &&
        selectedServer.server.users.length > 0 &&
        selectedServer.server.users.find(
          (user: any) => user.user._id === userId
        )
    );
    console.log(userExits);
    return !userExits;
  }
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
            <h2 className="text-white text-lg mb-2">Search Users</h2>
            <input
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                handleChange(e.target.value);
              }}
              className="bg-gray-700 p-4 rounded-md min-w-[30vw]"
              placeholder="Enter the user name of the user"
            />

            <div className="w-[100%]  flex flex-col gap-4">
              {users && users.length > 0 ? (
                users.map((user: any, index: number) => (
                  <div className="flex items-center p-5 gap-[5%] w-[100%] justify-between hover:bg-theme_gray/70">
                    <div className="flex items-center gap-[5%] w-[100%] justify-start hover:bg-theme_gray/70">
                      <img
                        src={user.profilePhoto}
                        alt="login"
                        className="w-[50px] h-[50px] rounded-[100%]"
                      />
                      <p className="text-white/70 ">{user.username}</p>
                    </div>
                    {checkUser(user._id) && (
                      <motion.div
                        className="bg-theme_gray px-4 py-[0.8rem] rounded-[50%] items-center justify-center text-theme_purple text-[1.2vw] cursor-pointer"
                        whileHover={{
                          scale: 1.2,
                        }}
                        whileTap={{
                          scale: 0.8,
                        }}
                        onClick={() => {
                          handleAddUser(user._id);
                        }}
                      >
                        <FontAwesomeIcon icon={faUserPlus} />
                      </motion.div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center">
                  <p className="text-white/70 ">No Users Found</p>
                </div>
              )}
            </div>
            <div className="flex justify-center gap-5 w-[100%] mt-5 ">
              <button className="bg-[#43B581] text-white text-[1vw] w-[30%] px-3 py-2 rounded-md mr-2">
                Add
              </button>
              <button
                className="bg-[#EC1212] text-white text-[1vw] px-3 w-[30%] py-2 rounded-md"
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
