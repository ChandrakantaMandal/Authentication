import React from "react";
import { motion } from "framer-motion";

const LoadingSpiner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex justify-center items-center relative overflow-hidden">
      <motion.div
        className="w-16 h-16 border-t-4 border-t-green-500 border-green-200 rounded-full"
        animate={{ rotate:360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      ></motion.div>
    </div>
  );
};

export default LoadingSpiner;
