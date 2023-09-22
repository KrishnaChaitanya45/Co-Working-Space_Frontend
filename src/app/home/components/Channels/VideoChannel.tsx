import React from "react";
import { motion, AnimatePresence } from "framer-motion";
function VideoChannel({ isActive }: { isActive: any }) {
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
            Video
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default VideoChannel;
