import { AppSelector } from "@/redux/hooks";
import {
  faArrowRightFromBracket,
  faEllipsis,
  faLock,
  faLockOpen,
  faMapPin,
  faMicrophone,
  faMicrophoneAlt,
  faMicrophoneAltSlash,
  faPaperPlane,
  faPaperclip,
  faSun,
  faThumbTack,
  faVideo,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Peer from "simple-peer";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { RoomContext } from "@/contexts/RoomContext";
import { getNavigator } from "@/app/login/components/Modal";
import { Accordion } from "@/utils/Accordian";
import { AccordionHeader, AccordionItem, AccordionPanel } from "../Channels";
import NotificationGenerator from "@/components/ToastMessage";

const Audio = (props: any) => {
  const ref = React.useRef<any>();

  useEffect(() => {
    console.log("=== REACHED HERE ===", props);
    props.peer.on("stream", (stream: any) => {
      console.log("=== STREAM RECEIVED===");
      console.log("=== STREAM ===", stream);
      ref.current.srcObject = stream;
    });
  }, []);

  return <video playsInline autoPlay ref={ref} />;
};

export default function AudioChannelPage() {
  const selectedChannel = AppSelector(
    (state) => state.server.selectedVideoChannel
  );
  const [messages, setMessages] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);
  const { socket } = useContext(RoomContext);
  const [devices, setDevices] = useState<any>([]);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const usersRef = React.useRef<any>([]);
  const ourVideo = React.useRef<any>();
  const [AudioDevicesOpen, setAudioDevicesOpen] = useState<boolean>(false);
  const [selectedAudioOutput, setSelectedAudioOutput] = useState<any>(null);
  const [stream, setStream] = useState<any>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideo, setIsVideo] = useState<boolean>(false);
  const axiosWithAccessToken = useAxiosPrivate();
  const selectedServer = AppSelector((state) => state.server.selectedServer);
  const auth = AppSelector((state) => state.auth.auth) as any;
  let isChannelRestricted = selectedChannel?.restrictAccess;
  const [audioContext, setAudioContext] = useState<any>(null);
  const toggleMic = () => {
    const audioStream = stream.getTracks().find((t: any) => {
      return t.kind == "audio";
    });
    if (audioStream) {
      audioStream.enabled = !audioStream.enabled;
      setIsMuted(!audioStream.enabled);
    }
  };
  const toggleVideo = () => {
    const audioStream = stream.getTracks().find((t: any) => {
      return t.kind == "video";
    });
    if (audioStream) {
      audioStream.enabled = !audioStream.enabled;
      setIsVideo(!audioStream.enabled);
    }
  };

  useEffect(() => {
    const handleTabClose = (event: any) => {
      console.log("=== SELECTED  CHANNEL ID", selectedChannel?._id);
      socket.emit("leave-mesh-audio-call", {
        channelId: selectedChannel?._id,
        userId: auth.user._id,
      });
      event.preventDefault();

      return (event.returnValue = "Are you sure you want to exit?");
    };
    console.log(selectedChannel);
    if (selectedChannel) {
      window.addEventListener("beforeunload", handleTabClose);
    }

    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, [selectedChannel]);
  useEffect(() => {
    if (selectedChannel) {
      isChannelRestricted = selectedChannel?.restrictAccess;
      const navigator = getNavigator() as any;
      navigator.permissions
        .query({ name: "microphone" })
        .then((result: any) => {
          if (result.state == "granted") {
            navigator.mediaDevices
              .getUserMedia({ audio: true, video: true })
              .then(async (stream: any) => {
                setStream(stream);
                const devices = await navigator.mediaDevices.enumerateDevices();
                const audioOutputs = devices.filter(
                  (device: any) => device.kind == "audiooutput"
                );
                console.log("=== AUDIO OUTPUTS ===", audioOutputs);
                setSelectedAudioOutput(audioOutputs[0]);
                setDevices(audioOutputs);
                if ("setSinkId" in AudioContext.prototype) {
                  console.log("=== AUDIO CONTEXT  REACHED HERE ===");
                  setAudioContext(new AudioContext());
                  console.log("=== AUDIO CONTEXT  ===", audioContext);
                }
              });
            setModalOpen(false);
          } else {
            setModalOpen(true);
          }
        });
    }
  }, [selectedChannel]);
  console.log("=== OUR VIDEO ===", ourVideo);
  console.log("=== SELECTED CHANNEL ===", selectedChannel);
  useEffect(() => {
    if (selectedChannel && stream) {
      ourVideo.current.srcObject = stream;
      socket.emit("join-mesh-audio-call", {
        channelId: selectedChannel?._id,
        userId: auth.user._id,
      });
      socket.on("all-users-in-audio-call", (users: any) => {
        const peers = [] as any;
        users.forEach((userID: any) => {
          const selectedUser =
            selectedServer &&
            selectedServer.server &&
            selectedServer.server.users.find((u: any) => u.user._id == userID)
              .user;
          if (selectedUser) {
            const peer = createPeer(
              selectedChannel._id,
              selectedUser._id,
              stream,
              selectedUser
            );
            usersRef.current.push({
              peerID: userID,
              peerDet: selectedUser,
              peer,
            });
            peers.push({ peer: peer, userDet: selectedUser });
          }
        });
        setUsers(peers);
      });

      socket.on("user-joined-audio", (payload: any) => {
        console.log("=== USER JOINED ===", payload);
        const peer = addPeer(
          payload.signal,
          payload.callerID,
          stream,
          payload.userDet
        );
        usersRef.current.push({
          peerID: payload.callerID,
          peerDet: payload.userDet,
          peer,
        });

        setUsers((users: any) => [
          ...users,
          { peer: peer, userDet: payload.userDet },
        ]);
      });

      socket.on("receiving returned signal-audio", (payload: any) => {
        console.log("== USER REF ===", usersRef.current);
        console.log("=== RECEIVING RETURNED SIGNAL ===", payload);
        const item = usersRef.current.find(
          (p: any) => p.peerID === payload.userDet._id
        );
        console.log("=== ITEM ===", item);
        item.peer.signal(payload.signal);
      });

      socket.on("user-left-audio-room", ({ userId, channelId }: any) => {
        console.log("=== USER LEFT ===", userId, channelId);
        const userRef = usersRef.current.find(
          (u: any) => u.peerDet._id == userId
        );
        console.log("=== USER REF ===", userRef);
        if (userRef) {
          errorRef.current?.({
            title: `${userRef.peerDet.displayname} left the Channel`,
            msg: `${userRef.peerDet.displayname} left the channel..! you can ask him to join again..! 😸`,
            type: "info",
          });
          userRef.peer.destroy();
        }

        const filteredUsers = usersRef.current.filter(
          (u: any) => u.peerDet._id != userId
        );

        usersRef.current = filteredUsers;
        setUsers(filteredUsers);
      });
    }
  }, [socket, selectedChannel, stream]);

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

  function createPeer(
    userToSignal: any,
    callerID: any,
    stream: any,
    userDet: any
  ) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });
    console.log("=== USR TO SIGNAL ===", userToSignal);
    peer.on("signal", (signal: any) => {
      socket.emit("sending signal-audio", {
        userToSignal,
        callerID,
        signal,
        channelId: selectedChannel._id,
        userDet,
      });
    });

    return peer;
  }

  function addPeer(
    incomingSignal: any,
    callerID: any,
    stream: any,
    userDet: any
  ) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal: any) => {
      console.log(" == REACHED HERE RETURNING SIGNAL ===", signal);
      socket.emit("returning signal-audio", {
        signal,
        callerID,
        userDet,
        channelId: selectedChannel._id,
      });
    });

    peer.signal(incomingSignal);

    return peer;
  }
  console.log("== USRES ===", users);
  console.log(selectedChannel);
  console.log(isUserLeadOrUser);
  let errorRef = React.useRef<any>();

  return (
    <>
      <div className="w-[100%] h-[100%] relative overflow-auto pb-[2.5%]">
        {selectedChannel && (
          <div className="flex w-[100%] h-[100%] gap-[2.5vh]  justify-start flex-col py-[1.5%] px-[2.5%]">
            <NotificationGenerator
              children={(addToast: any) => {
                errorRef.current = addToast;
              }}
            />
            {stream && !modalOpen ? (
              <>
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
                        icon={
                          selectedChannel.restrictAccess ? faLock : faLockOpen
                        }
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
                    <button
                      className="text-theme_red text-[1.5vw]"
                      onClick={() => {
                        console.log("CLICKED");
                        location.reload();
                        socket.emit("leave-mesh-audio-call", {
                          channelId: selectedChannel?._id,
                          userId: auth.user._id,
                        });
                        window.close();
                      }}
                    >
                      <FontAwesomeIcon icon={faArrowRightFromBracket} />
                    </button>
                  </motion.div>
                </div>
                <div className="flex mt-[2.5%] w-[90%] h-[90%] justify-center items-center flex-wrap gap-2">
                  <div className="bg-black/70 w-[40%] h-[50%] rounded-xl relative flex flex-col items-center justify-end py-2 shrink-0 mx-4 my-2 ">
                    <div className="flex mt-[7.5%] w-[100%] justify-start px-4 gap-4">
                      <div className="px-3 py-1 rounded-[12px] bg-theme_purple/70 flex items-center justify-center absolute bottom-0">
                        <p className="text-white text-[1.2vw] ">Krishna</p>
                      </div>
                      <video ref={ourVideo} autoPlay muted={true} />
                    </div>
                  </div>
                  {users &&
                    users.length > 0 &&
                    users.map((peer: any, index: number) => {
                      console.log("== PEER ==", peer);
                      return (
                        <div
                          className="bg-black/70 w-[40%] h-[50%] rounded-xl relative flex flex-col items-center shrink-0 mx-4 my-2 "
                          key={peer.peer._id}
                        >
                          <div className="flex  w-[100%] h-[25%] justify-between items-center p-4 absolute top-0">
                            <div className="px-3 py-1 rounded-[50%] bg-theme_purple/70 flex items-center justify-center ">
                              <p className="text-white text-[1.2vw] rotate-45">
                                <FontAwesomeIcon icon={faThumbTack} />
                              </p>
                            </div>
                            <div className="px-3 py-1 rounded-[50%] bg-theme_purple/70 flex items-center justify-center ">
                              <p className="text-white text-[1.2vw] ">
                                <FontAwesomeIcon icon={faEllipsis} />
                              </p>
                            </div>
                          </div>
                          <div className="bg-black/70 w-[100%] h-[100%] rounded-xl  flex flex-col items-center justify-end py-2 shrink-0 mx-4 my-2 absolute bottom-0 ">
                            <div className="flex mt-[7.5%] w-[100%] h-[100%] justify-start px-4 gap-4">
                              <div className="px-3 py-1 rounded-[12px] bg-theme_purple/70 flex items-center justify-center absolute bottom-0">
                                <p className="text-white text-[1.2vw] ">
                                  {peer.userDet ? peer.userDet.username : " "}
                                </p>
                              </div>
                              <div className="w-[100%] h-[100%]">
                                <Audio peer={peer.peer} />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  <div className="bg-theme_black rounded-lg w-[80%] h-[10%] self-end px-4 relative">
                    <div className="flex w-[100%] h-[100%] justify-between  items-center px-4">
                      <motion.p
                        className="text-white/70 text-[1vw] text-center cursor-pointer"
                        whileHover={{
                          scale: 1.05,
                        }}
                        transition={{
                          duration: 0.3,
                          stiffness: 100,
                        }}
                        whileTap={{
                          scale: 0.9,
                        }}
                        onClick={() => {
                          setAudioDevicesOpen(!AudioDevicesOpen);
                        }}
                      >
                        {selectedAudioOutput && selectedAudioOutput.label}
                      </motion.p>
                      <motion.div
                        className="px-3 py-1 rounded-[50%] bg-theme_purple/70 flex items-center justify-center cursor-pointer"
                        whileTap={{
                          scale: 0.9,
                        }}
                        whileHover={{
                          scale: 1.1,
                        }}
                        onClick={() => {
                          toggleMic();
                        }}
                      >
                        <p
                          className={`${
                            !isMuted ? "text-white" : "text-theme_red"
                          } text-[1.2vw] `}
                        >
                          <FontAwesomeIcon
                            icon={
                              isMuted ? faMicrophoneAltSlash : faMicrophoneAlt
                            }
                          />
                        </p>
                      </motion.div>
                      <motion.div
                        className="px-3 py-1 rounded-[50%] bg-theme_purple/70 flex items-center justify-center cursor-pointer"
                        whileTap={{
                          scale: 0.9,
                        }}
                        whileHover={{
                          scale: 1.1,
                        }}
                        onClick={() => {
                          toggleVideo();
                        }}
                      >
                        <p
                          className={`${
                            !isVideo ? "text-white" : "text-theme_red"
                          } text-[1.2vw] `}
                        >
                          <FontAwesomeIcon
                            icon={isVideo ? faVideoSlash : faVideo}
                          />
                        </p>
                      </motion.div>
                    </div>
                    <AnimatePresence initial={false}>
                      {AudioDevicesOpen && (
                        <motion.div
                          className="bg-theme_black/70 rounded-lg  absolute top-[-275%] max-h-[20vh] p-4 overflow-auto left-0 flex justify-center gap-4 flex-col items-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {devices &&
                            devices.map((item: any) => {
                              console.log(item);
                              return (
                                <motion.p
                                  className="flex flex-col w-[100%] h-[100%] cursor-pointer rounded-lg justify-center items-center gap-4  text-gray-700 hover:text-white/70 "
                                  whileHover={{
                                    scale: 1.05,
                                  }}
                                  transition={{
                                    duration: 0.3,
                                    stiffness: 100,
                                  }}
                                  whileTap={{
                                    scale: 0.9,
                                  }}
                                  onClick={() => {
                                    audioContext
                                      .setSinkId(item.deviceId)
                                      .then(() => {
                                        setSelectedAudioOutput(item);
                                      });
                                    setAudioDevicesOpen(false);
                                    console.log(
                                      "=== AUDIO CONTEXT ===",
                                      audioContext
                                    );
                                  }}
                                >
                                  {item.label}
                                </motion.p>
                              );
                            })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex w-[100%] h-[100%] justify-center items-center ">
                <div className="flex flex-col w-[50%] h-[50%] rounded-lg justify-center items-center gap-4 bg-theme_black">
                  <Image
                    src="/assests/sad_cat.png"
                    width={150}
                    height={150}
                    alt="Sad Cat Meme"
                  />
                  <p className="text-white text-[1.5vw]">
                    Please Allow Microphone Access
                  </p>
                  <motion.div
                    className="bg-[#202225] w-[4vw] h-[8vh] rounded-[100%] flex items-center justify-center cursor-pointer"
                    whileTap={{
                      scale: 0.9,
                    }}
                    whileHover={{
                      scale: 1.1,
                    }}
                  >
                    <span className="text-theme_yellow text-[1.5vw]">
                      <FontAwesomeIcon icon={faMicrophone} />
                    </span>
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
