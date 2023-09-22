import NotificationGenerator from "@/components/ToastMessage";
import { HomeContext } from "@/contexts/HomeRealTimeContext";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {
  addAudioChannel,
  addChannels,
  selectAudioChannel,
  selectServer,
} from "@/redux/features/Servers";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";
function AudioChannel({ isActive }: { isActive: any }) {
  const dispatch = useAppDispatch();
  const axiosWithAccessToken = useAxiosPrivate();
  const { socket } = useContext(HomeContext);
  const channels = useAppSelector((state) => state.server.channels);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const auth = useAppSelector((state) => state.auth.auth) as any;
  const [requestChannelId, setRequestChannelId] = useState("");
  const [message, setMessage] = useState("");
  const selectedServer = useAppSelector((state) => state.server.selectedServer);
  const [fetchedChannels, setFetchedChannels] = useState<any>([]);
  const [LoadingChannels, setLoadingChannels] = useState(true);
  console.log("== SELECTED SERVER ==", selectedServer);
  const fetchChannels = async () => {
    if (
      channels &&
      channels.audioChannels &&
      channels.audioChannels.length > 0
    ) {
      const thisServerChannels = channels.audioChannels.filter(
        (channel: any) => channel.belongsToServer === selectedServer.server._id
      );
      console.log("THIS SERVER CHANNELS", thisServerChannels);

      if (thisServerChannels && thisServerChannels.length > 0) {
        setFetchedChannels(thisServerChannels);
        setLoadingChannels(false);
      }
      return;
    } else if (
      selectedServer &&
      selectedServer.server &&
      typeof selectedServer.server.audioChannels[0] != typeof "random"
    ) {
      setFetchedChannels(selectedServer.server.audioChannels);
      dispatch(
        addChannels({
          audioChannels: selectedServer.server.audioChannels,
        })
      );
      setLoadingChannels(false);
      return;
    }
    try {
      const response = await axiosWithAccessToken.get(
        "/channel/" + selectedServer.server._id + "?type=audio"
      );
      if (response.status === 200) {
        console.log("REQUEST SUCCESSFULL", response.data.channels);

        dispatch(addAudioChannel(response.data.channels));
        const updatedServer = JSON.parse(JSON.stringify(selectedServer));
        updatedServer.server.audioChannels = response.data.channels;
        dispatch(selectServer(updatedServer));
      }
      setLoadingChannels(false);
    } catch (error) {
      console.log("REQUEST FAILED", error);
    }
  };
  useEffect(() => {
    setFetchedChannels([]);
    if (
      channels &&
      channels.audioChannels &&
      channels.audioChannels.length > 0
    ) {
      const thisServerChannels = channels.audioChannels.filter(
        (channel: any) => channel.belongsToServer === selectedServer.server._id
      );

      if (thisServerChannels && thisServerChannels.length > 0)
        setFetchedChannels(thisServerChannels);
    }
  }, [channels, selectedServer]);
  const isUser = Boolean(
    selectedServer &&
      selectedServer.server &&
      selectedServer.server.users &&
      selectedServer.server.users.find((u: any) => {
        //@ts-ignore
        if (
          auth &&
          auth.user &&
          auth.servers &&
          u.user._id == auth.user._id &&
          auth.user.servers.find(
            (s: any) => s.server == selectedServer.server._id
          ) &&
          u.roleId.User ===
            auth.user.servers.find(
              (s: any) => s.server == selectedServer.server._id
            ).role.id.User
        ) {
          return u;
        }
      })
  );
  const isLead = Boolean(
    selectedServer &&
      selectedServer.server &&
      selectedServer.server.users.find((u: any) => {
        //@ts-ignore
        if (
          auth &&
          auth.user &&
          u.user._id == auth.user._id &&
          auth.user.servers &&
          auth.user.servers.find(
            (s: any) => s.server == selectedServer.server._id
          ) &&
          u.roleId.Lead ===
            auth.user.servers.find(
              (s: any) => s.server == selectedServer.server._id
            ).role.id.Lead
        ) {
          return u;
        }
      })
  );
  useEffect(() => {
    console.log("REACHED HERE");
    setFetchedChannels([]);

    setLoadingChannels(true);
    if (isActive) {
      fetchChannels();
    }
    setLoadingChannels(false);
  }, [isActive, selectedServer]);
  const errorRef = React.useRef(null);
  console.log("=== FETCHED CHANNELS ==", fetchedChannels);
  return (
    <>
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="w-[100%]"
            transition={{ type: "spring", duration: 0.4, bounce: 0 }}
          >
            {fetchedChannels.length > 0 && !LoadingChannels ? (
              fetchedChannels.map((channel: any) => (
                <motion.div
                  className=" p-[20px] bg-[#4F545C] flex justify-between items-center w-[100%] hover:bg-[#4F545C]/50 cursor-pointer"
                  whileHover={{
                    scale: 1.05,
                  }}
                  onClick={() => {
                    console.log(channel.restrictAccess, isUser);
                    const userPresent = Boolean(
                      channel &&
                        channel.users &&
                        channel.users.length > 0 &&
                        channel.users.find(
                          (u: any) => u.user._id == auth.user._id
                        )
                    );
                    console.log("==== USER PRESENT ===", userPresent);
                    if (channel.restrictAccess && isUser && !userPresent) {
                      setShowRequestModal(true);
                      setRequestChannelId(channel._id);
                      return;
                    } else {
                      dispatch(selectAudioChannel(channel));
                    }
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                >
                  <div className="flex gap-4 w-[60%] items-center">
                    <img
                      src={channel.channelIcon}
                      className="w-[40px] h-[40px] rounded-[50%]"
                    />
                    <span>{channel.channelName}</span>
                  </div>
                  <div>
                    <FontAwesomeIcon
                      icon={channel.restrictAccess ? faLock : faLockOpen}
                    />
                  </div>
                </motion.div>
              ))
            ) : LoadingChannels ? (
              <div className="flex justify-center items-center w-[100%] h-[100%] p-5">
                <p className="text-white/70">Loading Channels</p>
              </div>
            ) : (
              <div className="flex justify-center items-center w-[100%] h-[100%] p-5">
                <p className="text-white/70">No Channels Found</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence initial={false}>
        <NotificationGenerator
          children={(add: any) => {
            //@ts-ignore
            errorRef.current = add;
          }}
        />
        {showRequestModal && (
          <motion.div
            className="fixed z-[100] top-0 left-0 w-full h-full flex items-center justify-center"
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
              <h2 className="text-white text-lg mb-2">Request Access</h2>
              <p className="text-white/70 text-[1vw]">
                You need to request access to this channel
              </p>
              <input
                type="text"
                placeholder="Why do you want to join this channel?"
                className="w-[25vw] bg-gray-700 rounded-md p-2 mb-2 text-white"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              />
              <div className="flex gap-4 mt-[2.5%]">
                <motion.button
                  className="bg-theme_red px-4 py-[0.8rem] rounded-[12px] items-center justify-center text-white text-[1.2vw] cursor-pointer"
                  whileHover={{
                    scale: 1.1,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                  onClick={() => {
                    setShowRequestModal(false);
                  }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className={`bg-theme_purple px-4 py-[0.8rem] rounded-[12px] items-center justify-center text-white text-[1.2vw] cursor-pointer ${
                    message.length < 1 && "opacity-50"
                  }`}
                  whileHover={{
                    scale: 1.1,
                  }}
                  disabled={message.length < 1 ? true : false}
                  whileTap={{
                    scale: 0.9,
                  }}
                  onClick={async () => {
                    try {
                      //@ts-ignore
                      errorRef?.current?.({
                        title: "We're Processing Your Request ⭐",
                        msg: "We're sending a request to the server to join the channel",
                        type: "info",
                      });
                      const response = await axiosWithAccessToken.post(
                        `/channel/${requestChannelId}/requests`,
                        {
                          userId: auth.user._id,
                          message: message,
                        }
                      );
                      console.log(response);
                      if (response.status == 201) {
                        socket.emit("channel-requested", {
                          serverId: selectedServer.server._id,
                          server: response.data.server,
                          channelName: response.data.channelName,
                          request: response.data.request,
                        });
                        //@ts-ignore
                        errorRef?.current?.({
                          title: response.data.title,
                          msg: response.data.message,
                          type: "success",
                        });
                        setShowRequestModal(false);
                      }
                    } catch (error: any) {
                      if (error.response)
                        //@ts-ignore
                        errorRef?.current?.({
                          title: error.response.data.title,
                          msg: error.response.data.message,
                          type: "error",
                        });
                      else {
                        //@ts-ignore
                        errorRef?.current?.({
                          title: "Error 😢",
                          msg: "Error while requesting access",
                          type: "error",
                        });
                      }
                    }
                  }}
                >
                  Request
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AudioChannel;
