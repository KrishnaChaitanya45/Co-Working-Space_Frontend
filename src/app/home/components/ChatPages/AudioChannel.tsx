import { AppSelector } from "@/redux/hooks";
import {
  faArrowRightFromBracket,
  faEllipsis,
  faLock,
  faLockOpen,
  faMapPin,
  faMicrophone,
  faPaperPlane,
  faPaperclip,
  faSun,
  faThumbTack,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";

import Peer from "simple-peer";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { RoomContext } from "@/contexts/RoomContext";
import { getNavigator } from "@/app/login/components/Modal";

const Audio = (props: any) => {
  const ref = React.useRef<any>(null);

  useEffect(() => {
    props.peer.on("stream", (stream: any) => {
      //@ts-ignore
      ref.current.srcObject = stream;
    });
  }, []);

  return <audio playsInline autoPlay ref={ref} />;
};

export default function AudioChannelPage() {
  const selectedChannel = AppSelector(
    (state) => state.server.selectedAudioChannel
  );
  const [messages, setMessages] = useState<any>([]);
  const [users, setUsers] = useState<any>([]);
  const { socket } = useContext(RoomContext);
  const usersRef = React.useRef<any>([]);
  const ourVideo = React.useRef<any>();
  const axiosWithAccessToken = useAxiosPrivate();
  const selectedServer = AppSelector((state) => state.server.selectedServer);
  const auth = AppSelector((state) => state.auth.auth) as any;
  let isChannelRestricted = selectedChannel?.restrictAccess;
  useEffect(() => {
    isChannelRestricted = selectedChannel?.restrictAccess;
  }, [selectedChannel]);
  console.log("=== OUR VIDEO ===", ourVideo);
  useEffect(() => {
    if (selectedChannel) {
      const navigator = getNavigator() as any;
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream: any) => {
          selectedChannel && (ourVideo.current.srcObject = stream);

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
                selectedServer.server.users.find(
                  (u: any) => u.user._id == userID
                ).user;
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
            const item = usersRef.current.find(
              (p: any) => p.peerID === payload.id
            );
            item.peer.signal(payload.signal);
          });
        });
    }
  }, [socket, selectedChannel]);

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
      socket.emit("returning signal-audio", { signal, callerID, userDet });
    });

    peer.signal(incomingSignal);

    return peer;
  }
  console.log("== USRES ===", users);
  console.log(selectedChannel);
  console.log(isUserLeadOrUser);
  let audioRef = React.createRef<HTMLVideoElement>();
  return (
    <div className="w-[100%] h-[100%] relative overflow-auto pb-[2.5%]">
      {selectedChannel && (
        <div className="flex w-[100%] h-[100%] gap-[2.5vh]  justify-start flex-col py-[1.5%] px-[2.5%]">
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
              <span className="text-theme_red text-[1.5vw]">
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
              </span>
            </motion.div>
          </div>
          <div className="flex mt-[2.5%] w-[90%] h-[90%] justify-center items-center flex-wrap gap-2">
            <div className="bg-black/70 w-[40%] h-[50%] rounded-xl relative flex flex-col items-center shrink-0 mx-4 my-2 ">
              <div className="flex  w-[100%] h-[25%] justify-between items-center p-4">
                <motion.div
                  className="px-3 py-1 rounded-[50%] bg-theme_purple/70 flex items-center justify-center cursor-pointer"
                  whileTap={{
                    scale: 0.9,
                  }}
                  whileHover={{
                    scale: 1.1,
                  }}
                >
                  <p className="text-white text-[1.2vw] rotate-45">
                    <FontAwesomeIcon icon={faThumbTack} />
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
                >
                  <p className="text-white text-[1.2vw] ">
                    <FontAwesomeIcon icon={faEllipsis} />
                  </p>
                </motion.div>
              </div>
              <div className="flex  w-[40%] h-[50%] justify-center items-center">
                <img
                  src="./assests/login_background.png"
                  alt="Image Failed"
                  className="w-[100%] h-[100%] object-cover rounded-[100%] "
                />
              </div>
              <div className="flex mt-[7.5%] w-[100%] justify-start px-4 gap-4">
                <div className="px-3 py-1 rounded-[50%] bg-theme_purple/70 flex items-center justify-center ">
                  <p className="text-white text-[1.2vw] ">
                    <FontAwesomeIcon icon={faMicrophone} />
                  </p>
                </div>
                <div className="px-3 py-1 rounded-[12px] bg-theme_purple/70 flex items-center justify-center ">
                  <p className="text-white text-[1.2vw] ">Krishna</p>
                </div>
                <audio ref={ourVideo} autoPlay playsInline />
              </div>
            </div>
            {users &&
              users.length > 0 &&
              users.map((peer: any, index: number) => {
                console.log("== PEER ==", peer);
                return (
                  <div className="bg-black/70 w-[40%] h-[50%] rounded-xl relative flex flex-col items-center shrink-0 mx-4 my-2 ">
                    <div className="flex  w-[100%] h-[25%] justify-between items-center p-4">
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
                    <div className="flex  w-[40%] h-[50%] justify-center items-center">
                      <img
                        src={
                          peer.userDet
                            ? peer.userDet.profilePhoto
                            : "./assests/login_background.png"
                        }
                        alt="Image Failed"
                        className="w-[100%] h-[100%] object-cover rounded-[100%] "
                      />
                    </div>
                    <div className="flex mt-[7.5%] w-[100%] justify-start px-4 gap-4">
                      <div className="px-3 py-1 rounded-[50%] bg-theme_purple/70 flex items-center justify-center ">
                        <p className="text-white text-[1.2vw] ">
                          <FontAwesomeIcon icon={faMicrophone} />
                        </p>
                      </div>
                      <div className="px-3 py-1 rounded-[12px] bg-theme_purple/70 flex items-center justify-center ">
                        <p className="text-white text-[1.2vw] ">
                          {peer.userDet ? peer.userDet.username : ""}
                        </p>
                      </div>
                      <Audio peer={peer.peer} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
