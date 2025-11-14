import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const Searchbar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 60,
        damping: 12,
        duration: 0.8,
      }}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => setIsFocused(true)}
        placeholder="Search..."
        className="w-full border rounded-2xl px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {isFocused && results.length > 0 && (
        <motion.ul
          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {results.map((item, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition"
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
  );
};

export default Searchbar;
