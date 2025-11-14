import React from "react";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaCalendarCheck,
  FaCalendarTimes,
  FaDollarSign,
  FaEnvelope,
} from "react-icons/fa";

const Navbar: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 60,
        damping: 12,
        duration: 0.8,
      }}
    >
      <nav className="flex justify-center gap-6 m-4 px-6 py-3">
        <span className="cursor-pointer hover:text-blue-700 transition flex items-center gap-2">
          <FaMapMarkerAlt /> Where
        </span>
        <span className="cursor-pointer hover:text-blue-700 transition flex items-center gap-2">
          <FaCalendarCheck /> Check In
        </span>
        <span className="cursor-pointer hover:text-blue-700 transition flex items-center gap-2">
          <FaCalendarTimes /> Check Out
        </span>
        <span className="cursor-pointer hover:text-blue-700 transition flex items-center gap-2">
          <FaDollarSign /> Pricing
        </span>
        <span className="cursor-pointer hover:text-blue-700 transition flex items-center gap-2">
          <FaEnvelope /> Contact
        </span>
      </nav>
    </motion.div>
  );
};

export default Navbar;
