import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useAppDispatch, AppSelector } from "@/redux/hooks";
import { faBell, faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React, { useContext, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import NotificationGenerator from "@/components/ToastMessage";
import { HomeContext } from "@/contexts/HomeRealTimeContext";
import { updateChannels, updateTextChannels } from "@/redux/features/Servers";
function Navbar() {
  const dispatch = useAppDispatch();
  const axiosWithAuth = useAxiosPrivate();
  const [requestChannel, setRequestChannel] = React.useState(null);
  const { socket } = useContext(HomeContext);
  const [showNotification, setShowNotification] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);
  const selectedChannel = AppSelector((state) => state.server.selectedChannel);
  const auth = AppSelector((state) => state.auth.auth);
  const selectedServer = AppSelector((state) => state.server.selectedServer);

  const fetchJoinRequests = async () => {
    try {
      const response = await axiosWithAuth.get(
        `/channel/${selectedChannel._id}/requests`
      );
      console.log(response);
      if (response.status == 200) {
        setNotifications(response.data.requests);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    let isAdminOrManager = false;
    if (selectedServer) {
      console.log(selectedServer.server);
      selectedServer.server.users.forEach((user) => {
        if (user.user._id == auth.user._id) {
          if (user.roleId.Admin > 9000 || user.roleId.Manager > 8000) {
            isAdminOrManager = true;
          }
        }
      });
    }
    if (selectedChannel && isAdminOrManager) {
      fetchJoinRequests();
    }
  }, [selectedChannel, selectedServer]);

  useEffect(() => {
    socket.on("channel-requested-notify", ({ serverId, request, channel }) => {
      console.log("New Join Request", request);
      setRequestChannel(channel);
      //@ts-ignore
      errorRef.current({
        title: "New Join Request",
        msg: `${request.user.username} has requested to join ${channel.channelName}`,
        type: "success",
      });
      console.log(selectedServer);

      //@ts-ignore
      setNotifications((prev) => [...prev, request]);
    });
    socket.on(
      "channel-accepted-or-rejected-notify",
      ({ request, channelName, action }) => {
        console.log("New Join Request", request);
        //@ts-ignore
        if (action > 5000) {
          errorRef.current({
            title: "Join Request Accepted 🔥🎉",
            msg: `${request.user.username} has been accepted to join ${channelName.channelName}`,
            type: "success",
          });
          dispatch(updateTextChannels(channelName));
          console.log(selectedServer);
        } else {
          errorRef.current({
            title: "Join Request Rejected 😢💔",
            msg: `${request.user.username} has been rejected to join ${channelName.channelName}`,
            type: "error",
          });
        }
      }
    );
    return () => {
      socket.off("channel-requested-notify");
      socket.off("channel-request-accepted-notify");
    };
  }, [socket]);
  let errorRef = React.useRef(null);
  const acceptOrRejectRequest = async (
    action: string,
    requestId: any,
    userId: string
  ) => {
    console.log(requestId);
    console.log(requestChannel);
    try {
      let actionToPerform =
        action == "accept"
          ? Math.floor(Math.random() * 1000) + 5000
          : Math.floor(Math.random() * 1000) + 3000;

      const response = await axiosWithAuth.patch(
        `/channel/${
          selectedChannel ? selectedChannel._id : requestChannel._id
        }/requests/`,
        {
          channelId: selectedChannel ? selectedChannel._id : requestChannel._id,
          requestId: requestId._id,
          userId: userId,
          action: actionToPerform,
        }
      );

      console.log(response);
      socket.emit("channel-accepted-or-rejected", {
        request: requestId,
        serverId: selectedServer.server
          ? selectedServer.server._id
          : requestChannel.belongsToServer._id,
        action: actionToPerform,
        channelName: response.data.channel,
      });
      if (response.status == 201) {
        setNotifications(response.data.requests);
        errorRef.current({
          title: response.data.title,
          msg: response.data.message,
          type: "success",
        });
      }
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        errorRef.current({
          title: error.response.data.title,
          msg: error.response.data.message,
          type: "error",
        });
      }
    }
  };
  return (
    <nav className=" w-[10%] h-[10%] absolute top-0 right-[2.5%]">
      <div className="flex items-center justify-between w-[90%] h-[100%] ml-[10%] pr-[2.5%]">
        <div>{/* <h1 className="text-white">Channel Name</h1> */}</div>
        <NotificationGenerator
          children={(add: any) => {
            //@ts-ignore
            errorRef.current = add;
          }}
        />
        <div className="flex gap-4 items-center mt-4">
          <motion.div
            className="bg-[#202225] w-[4vw] h-[8vh] rounded-[100%] flex items-center justify-center relative cursor-pointer"
            whileHover={{
              scale: 1.1,
            }}
            whileTap={{
              scale: 0.9,
            }}
            onClick={() => setShowNotification(!showNotification)}
          >
            <div className="absolute top-0 right-0 w-[1.5vw] h-[1.5vw] bg-theme_red rounded-[100%] flex items-center justify-center text-white text-xs">
              {notifications.length}
            </div>
            <FontAwesomeIcon
              icon={faBell}
              className="text-theme_yellow w-[50%] h-[50%]"
            />
          </motion.div>
          <AnimatePresence initial={false}>
            {showNotification && (
              <motion.div
                className="min-w-[30vw] absolute top-[12.5vh] right-[0%] bg-theme_black overflow-auto flex flex-col items-center justify-center p-4 rounded-xl"
                initial={{
                  opacity: 0,
                  x: 100,
                  y: -100,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  x: 100,
                  y: -100,
                }}
                transition={{
                  duration: 0.3,
                  stiffness: 100,
                }}
              >
                {notifications.length > 0 ? (
                  notifications.map((notification: any) => (
                    <>
                      <div className="w-[95%] bg-theme_gray rounded-xl p-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center justify-between w-[100%] gap-2">
                            <div className="flex gap-4 items-center justify-center">
                              <div className="bg-[#202225] w-[4vw] h-[8vh] rounded-[100%] flex items-center justify-center">
                                <img
                                  src={
                                    notification.user.profilePhoto ||
                                    "/assests/Login.svg"
                                  }
                                  alt="login"
                                  className="w-[90%] h-[90%] rounded-[100%]"
                                />
                              </div>
                              <div className="flex flex-col">
                                <h1 className="text-white">
                                  {notification.user.username}
                                </h1>
                                <h1 className="text-white text-xs">
                                  {notification.message}
                                </h1>
                              </div>
                            </div>
                            <div className="flex items-center justify-center gap-4">
                              <motion.div
                                className="bg-theme_red w-[3vw] h-[6vh] rounded-[100%] flex items-center justify-center cursor-pointer"
                                onClick={() => {
                                  acceptOrRejectRequest(
                                    "reject",
                                    notification,
                                    notification.user._id
                                  );
                                }}
                                initial={{
                                  scale: 1,
                                }}
                                whileHover={{
                                  scale: [1, 1.05, 1.1, 1.05, 1, 0.95, 0.9],
                                }}
                                transition={{
                                  duration: 0.75,
                                  stiffness: 200,
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faX}
                                  className="text-black/70 text-[1.2vw]"
                                />
                              </motion.div>
                              <motion.div
                                className="bg-theme_green w-[3vw] h-[6vh] rounded-[100%] flex items-center justify-center cursor-pointer"
                                onClick={() => {
                                  acceptOrRejectRequest(
                                    "accept",
                                    notification,
                                    notification.user._id
                                  );
                                }}
                                initial={{
                                  y: [0, 0, 0, 0, 0, 0],
                                }}
                                whileHover={{
                                  scale: 1.1,
                                  y: [-5, -10, -15, -10, -15, 0],
                                }}
                                transition={{
                                  duration: 0.5,
                                  stiffness: 100,
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faCheck}
                                  className="text-black/70 text-[1.2vw]"
                                />
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ))
                ) : (
                  <div className="w-[90%] bg-theme_gray rounded-xl p-2">
                    <h1 className="text-white">No New Notifications ⭐</h1>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="bg-[#202225] w-[4vw] h-[8vh] rounded-[100%] flex items-center justify-center">
            <img
              src={auth.user ? auth.user.profilePhoto : "/assests/Login.svg"}
              alt="login"
              className="w-[90%] h-[90%] rounded-[100%]"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
