import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";

interface SearchbarProps {
  alwaysExpanded?: boolean;
  containerClassName?: string; // NEW: allow caller to control max width
}

const Searchbar: React.FC<SearchbarProps> = ({ alwaysExpanded = false, containerClassName }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = [
    "Home",
    "About Us",
    "Services",
    "Contact",
    "Blog",
    "Careers",
    "Pricing",
    "FAQ",
  ];

  const handleSearch = (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    const filtered = items.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );
    setResults(filtered);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
        if (!alwaysExpanded) setQuery("");
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [alwaysExpanded]);

  useEffect(() => {
    if (alwaysExpanded) {
      inputRef.current?.focus();
    }
  }, [alwaysExpanded]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${containerClassName ?? "max-w-xs sm:max-w-sm md:max-w-md"} mx-auto`}
    >
      <motion.div
        className="relative w-full"
        initial={{ width: "100%", opacity: 0 }}
        animate={{ width: "100%", opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search..."
            className="w-full border bg-white border-gray-300 rounded-full pl-10 pr-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {isFocused && results.length > 0 && (
          <motion.ul
            className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {results.map((item, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition text-black text-xs"
                onClick={() => {
                  setQuery(item);
                  setIsFocused(false);
                }}
              >
                {item}
              </li>
            ))}
          </motion.ul>
        )}
      </motion.div>
    </div>
  );
};

export default Searchbar;
