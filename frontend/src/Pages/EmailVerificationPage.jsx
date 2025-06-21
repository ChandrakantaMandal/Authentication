import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const {error, isLoading, verifyEmail} = useAuthStore();

  const handleChange = (index, value) => {
    const newCode = [...code];

    //handele pasted content
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);
      //focus on the lastnon-empty input or the frist empty one
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);
      //Move foucs to the next input field if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSumit = async(e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    
    // Add validation
    if (verificationCode.length !== 6) {
      console.error("Please enter a valid 6-digit code");
      return;
    }
    
    try {
      await verifyEmail(verificationCode);
      navigate("/");
      toast.success("Email Verified Successfully");
    } catch (error) {
      console.error("Verification error:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Verification failed");
    }
  };

  //Auto Sumbit in all field are filed
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSumit(new Event("submit"));
    }

  }, [code]);

  return (
    <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl o overflow-hidden">
      {error&&<p className="text-red-500 font-semibold mt-2">{error}</p>}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md "
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Verify Your Email
        </h2>
        <p className="text-center text-gray-300 mb-6 ">
          Enter the code sent to your email address
        </p>
        <form onSubmit={handleSumit} className="space-y-6">
          <div className="flex justify-between ">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                maxLength="6"
                type="text"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-500 rounded-lg focus:border-green-500 focus:outline-none"
              />
            ))}
          </div>
          <motion.button
            className="mt-5 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.02 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Verify Email"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;
