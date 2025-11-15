import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaGlobe, FaChevronDown, FaBell } from "react-icons/fa";

const Navbar: React.FC = () => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");

  const toggleLangDropdown = () => setIsLangOpen(!isLangOpen);
  const handleLanguageSelect = (lang: string) => {
    setSelectedLang(lang);
    setIsLangOpen(false);
  };

  const languages = ["English", "Español", "हिन्दी", "日本語", "中文"];

  const navItems = [
    { label: "Destination" },
    { label: "Check In" },
    { label: "Check Out" },
    { label: "Pricing" },
    { label: "Contact" },
  ];

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
      <nav className="flex justify-between items-center gap-6 m-4 px-6 py-3 bg-[#0E1514]">
        <div className="flex items-center">
          <img
            src="/assets/logo.jpg"
            alt="Mount Treks Logo"
            className="h-10 w-auto cursor-pointer"
          />
        </div>

        <div className="flex gap-2 text-white h-full items-center -my-3">
          {navItems.map((item, index) => (
            <span
              key={index}
              className="cursor-pointer hover:text-blue-400 hover:bg-white/10 transition font-medium text-m px-4 py-6 h-full flex items-center"
            >
              {item.label}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-300 text-black hover:bg-gray-400 transition">
            <FaBell size={12} />
          </button>

          <div className="relative w-28 shrink-0">
            <button
              onClick={toggleLangDropdown}
              aria-haspopup="listbox"
              aria-expanded={isLangOpen}
              className="flex w-full items-center justify-between gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-black shadow-sm transition hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <span className="flex items-center gap-2">
                <FaGlobe className="text-black text-xs" />
                {selectedLang}
              </span>
              <FaChevronDown
                className={`text-[10px] transition-transform ${
                  isLangOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isLangOpen && (
              <ul
                role="listbox"
                className="absolute left-0 right-0 mt-2 overflow-hidden rounded-lg border border-gray-300 bg-white text-sm shadow-lg z-20"
              >
                {languages.map((lang) => (
                  <li
                    key={lang}
                    role="option"
                    aria-selected={selectedLang === lang}
                    onClick={() => handleLanguageSelect(lang)}
                    className={`cursor-pointer px-3 py-2 transition hover:bg-gray-100 ${
                      selectedLang === lang
                        ? "bg-gray-100 font-semibold text-black"
                        : "text-black"
                    }`}
                  >
                    {lang}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </nav>
    </motion.div>
  );
};

export default Navbar;
