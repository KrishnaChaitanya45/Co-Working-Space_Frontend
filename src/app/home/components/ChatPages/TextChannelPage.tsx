import { useAppSelector } from "@/redux/hooks";
import {
  faLock,
  faLockOpen,
  faPaperPlane,
  faPaperclip,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { HomeContext } from "@/contexts/HomeRealTimeContext";
import { RoomContext } from "@/contexts/RoomContext";
export default function ChannelPage() {
  const selectedChannel = useAppSelector(
    (state) => state.server.selectedTextChannel
  );
  const [messages, setMessages] = useState<any>([]);
  const { socket } = useContext(RoomContext);
  const axiosWithAccessToken = useAxiosPrivate();
  const selectedServer = useAppSelector((state) => state.server.selectedServer);
  const auth = useAppSelector((state) => state.auth.auth) as any;
  let isChannelRestricted = selectedChannel?.restrictAccess;
  useEffect(() => {
    isChannelRestricted = selectedChannel?.restrictAccess;
    if (selectedChannel) {
      socket.emit("join-room", selectedChannel?._id);
      fetchMessages();
    }
    setMessage("");
  }, [selectedChannel]);
  useEffect(() => {
    socket.on("message-received", (message: any) => {
      console.log("== RECEIVED MESSAGE ==", message);
      setMessages((prev: any) => [...prev, message]);
    });
    return () => {
      socket.off("message-received");
    };
  }, [socket]);
  let isUserLeadOrUser = false;
  if (selectedServer && selectedServer.server)
    selectedServer.server.users.forEach((u: any) => {
      console.log(u);
      if (u.user._id == auth.user._id) {
        if (u.roleId.User > 5000 || u.roleId.Lead > 6000) {
          isUserLeadOrUser = true;
        }
      }
    });
  console.log(selectedChannel);
  console.log(isUserLeadOrUser);
  const [message, setMessage] = React.useState("");
  const [media, setMedia] = React.useState(null);
  const sendMessage = async () => {
    console.log("CLICKED");
    try {
      setMessage("");
      setMessages((prev: any) => [
        ...prev,
        { message, media, sender: auth.user },
      ]);
      const response = await axiosWithAccessToken.post(
        `/message/${selectedChannel?._id}/`,
        {
          message: message,
          media: media,
        }
      );
      socket.emit("send-message", {
        ...response.data.message,
        channelId: selectedChannel?._id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axiosWithAccessToken.get(
        `/message/${selectedChannel?._id}/`
      );

      setMessages(response.data.messages);
    } catch (error) {
      console.log("FETCHING MESSAGES FAILED");
    }
  };
  console.log("== MESSAGES ==", messages);
  return (
    <div className="w-[100%] h-[100%] relative">
      {selectedChannel && (
        <div className="flex w-[100%] h-[100%] gap-[2.5vh]  justify-around flex-col py-[1.5%] px-[2.5%]">
          <div className="flex justify-between  w-[83.5%] h-[10%]">
            <div className="flex  justify-center items-center  gap-8">
              <img
                src={selectedChannel.channelIcon}
                alt=""
                className="w-[2.5vw] h-[2.5vw] rounded-[100%]"
              />
              <p className="text-white text-[1.2vw]">
                {selectedChannel.channelName}
              </p>

              <p className="text-white text-[1.2vw]">
                <FontAwesomeIcon
                  icon={selectedChannel.restrictAccess ? faLock : faLockOpen}
                />
              </p>
            </div>

            <motion.div
              className="bg-[#202225] w-[4vw] h-[8vh] rounded-[100%] flex items-center justify-center cursor-pointer"
              whileTap={{
                scale: 0.9,
              }}
              whileHover={{
                scale: 1.1,
              }}
            >
              <span className="text-white text-[1.5vw]">
                <FontAwesomeIcon icon={faSun} />
              </span>
            </motion.div>
          </div>

          <div className=" h-[80%] w-[100%] overflow-auto flex flex-col gap-4">
            {messages.map((message: any, index: number) => {
              const sender = message.sender;
              let senderRole = 5432;
              selectedServer.server.users.forEach((u: any) => {
                if (u.user._id == sender._id) {
                  //@ts-ignore
                  senderRole = Object.values(u.roleId)[0];
                }
              });
              const sameSender = messages[index - 1]?.sender._id == sender._id;
              const isLastMessage =
                index == messages.length - 1 ||
                messages[index + 1]?.sender._id != sender._id;
              console.log("== SENDER ROLE ==", senderRole);
              let color =
                senderRole < 7000
                  ? "bg-theme_black"
                  : senderRole < 8000
                  ? "bg-theme_yellow"
                  : senderRole < 9000
                  ? "bg-theme_blue"
                  : "bg-theme_purple";
              return (
                <div
                  key={index}
                  className={`flex gap-4 items-center justify-start w-[100%] ${
                    message.sender._id == auth.user._id
                      ? "flex-row-reverse"
                      : "flex-row"
                  }`}
                >
                  <div className=" max-w-[40%] min-w-[10%] flex items-center justify-center gap-4">
                    <div className={`${color} p-4 rounded-lg`}>
                      <p className="text-white text-[1.2vw]">
                        {message.message}
                      </p>
                    </div>
                    {isLastMessage && (
                      <div
                        className={`bg-[#202225] w-[3vw] h-[6vh] rounded-[100%] gap-4 flex items-center justify-center ${
                          message.sender._id == auth.user._id
                            ? "ml-auto"
                            : "mr-auto"
                        }`}
                      >
                        <img
                          src={message.sender.profilePhoto}
                          alt="login"
                          className="w-[90%] h-[90%] rounded-[100%]"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {isChannelRestricted ? (
            isUserLeadOrUser === false ? (
              <div className="bg-theme_black h-[10%] w-[80%] mx-auto items-center justify-around rounded-[20px] flex">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message"
                  className="w-[80%] h-[100%] bg-transparent focus:outline-none text-white text-[1.25vw] p-[2.5%]"
                />
                <motion.div
                  className="bg-theme_purple w-[7.5%] h-[80%] rounded-[50%] flex items-center justify-center cursor-pointer text-white/70 text-[1.5vw]"
                  whileTap={{
                    scale: 0.9,
                  }}
                  whileHover={{
                    scale: 1.1,
                  }}
                >
                  <FontAwesomeIcon icon={faPaperclip} />
                </motion.div>
                <motion.div
                  className="bg-theme_purple w-[7.5%] h-[80%] rounded-[50%] flex items-center justify-center cursor-pointer text-white/70 text-[1.5vw]"
                  whileTap={{
                    scale: 0.9,
                  }}
                  whileHover={{
                    scale: 1.1,
                  }}
                  onClick={sendMessage}
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </motion.div>
              </div>
            ) : (
              <div className="bg-theme_black h-[10%] w-[80%] mx-auto items-center justify-around rounded-[20px] flex opacity-70">
                <h1 className="text-white/70 text-[1.2vw]">
                  You cannot message in this channel
                </h1>
              </div>
            )
          ) : (
            <div className="bg-theme_black h-[10%] w-[80%] mx-auto items-center justify-around rounded-[20px] flex">
              <input
                type="text"
                placeholder="Enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-[80%] h-[100%] bg-transparent focus:outline-none text-white text-[1.25vw] p-[2.5%]"
              />
              <motion.div
                className="bg-theme_purple w-[7.5%] h-[80%] rounded-[50%] flex items-center justify-center cursor-pointer text-white/70 text-[1.5vw]"
                whileTap={{
                  scale: 0.9,
                }}
                whileHover={{
                  scale: 1.1,
                }}
              >
                <FontAwesomeIcon icon={faPaperclip} />
              </motion.div>
              <motion.div
                className="bg-theme_purple w-[7.5%] h-[80%] rounded-[50%] flex items-center justify-center cursor-pointer text-white/70 text-[1.5vw]"
                whileTap={{
                  scale: 0.9,
                }}
                whileHover={{
                  scale: 1.1,
                }}
                onClick={sendMessage}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </motion.div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
