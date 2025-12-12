import React, { useState, useRef, useEffect } from "react";
import {
  FaSearch,
  FaHistory,
  FaTimes,
  FaMapMarkerAlt,
  FaArrowRight,
  FaMountain,
} from "react-icons/fa";

interface SearchbarProps {
  containerClassName?: string;
}

const HighlightText = ({
  text,
  highlight,
}: {
  text: string;
  highlight: string;
}) => {
  if (!highlight.trim()) return <span className="text-gray-700">{text}</span>;
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <strong
            key={i}
            className="text-black font-extrabold decoration-gray-400 underline underline-offset-2"
          >
            {part}
          </strong>
        ) : (
          <span key={i} className="text-gray-600">
            {part}
          </span>
        )
      )}
    </span>
  );
};

const Searchbar: React.FC<SearchbarProps> = ({ containerClassName }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);

  const featuredPlaces = ["Illam", "Everest Base Camp"];
  const items = [
    "Home",
    "About Us",
    "Services",
    "Contact",
    "Blog",
    "Careers",
    "Pricing",
    "FAQ",
    "Kathmandu Valley",
    "Annapurna Trek",
    "Mount Everest",
    "Langtang Region",
    "Mustang Expedition",
    "Chitwan National Park",
    "Lumbini",
  ];

  // Load recent searches and enforce limit immediately
  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure we never load more than 5, even if bad data exists
      setRecent(Array.isArray(parsed) ? parsed.slice(0, 5) : []);
    }
  }, []);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query, isOpen]);

  // Lock body scroll and focus input
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const addToRecent = (item: string) => {
    // Filter out duplicates then take top 4 + new item = 5 max
    const updated = [item, ...recent.filter((r) => r !== item)].slice(0, 5);
    setRecent(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

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

  const handleSelect = (item: string) => {
    setQuery(item);
    addToRecent(item);
    setIsOpen(false);
    setQuery("");
    console.log(`Navigating to: ${item}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    // Determine what list is currently visible
    let activeList: string[] = [];
    if (!query) activeList = [...recent, ...featuredPlaces];
    else activeList = results;

    if (activeList.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < activeList.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : activeList.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(activeList[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const removeRecent = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    const updated = recent.filter((r) => r !== item);
    setRecent(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const clearAllRecent = () => {
    setRecent([]);
    localStorage.removeItem("recentSearches");
  };

  return (
    <>
      {/* TRIGGER BUTTON */}
      <div
        className={`relative z-10 w-full ${
          containerClassName ?? "max-w-2xl"
        } mx-auto font-sans`}
      >
        <div
          className="w-full bg-white/70 backdrop-blur-md border border-white/50 hover:bg-white hover:shadow-lg
            transition-all duration-300 rounded-full px-5 py-3 flex items-center cursor-pointer group shadow-sm"
          onClick={() => setIsOpen(true)}
        >
          <FaSearch className="text-gray-500 group-hover:text-black mr-3 transition-colors" />
          <span className="text-gray-600 group-hover:text-black transition-colors flex-1 font-medium text-sm sm:text-base">
            Find your destination...
          </span>
          <div className="hidden sm:block bg-gray-100/50 rounded px-2 py-0.5 text-[10px] text-gray-500 font-bold border border-gray-200 group-hover:border-gray-400 group-hover:text-gray-700">
            CMD+K
          </div>
        </div>
      </div>

      {/* MODAL OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-start sm:items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* MODAL CONTAINER */}
          <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl ring-1 ring-black/5 flex flex-col max-h-[85vh] sm:max-h-[70vh] animate-fade-in-up overflow-hidden">
            {/* HEADER (Fixed) */}
            <div className="flex-none relative border-b border-gray-200/80 bg-white/50">
              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search treks, peaks, or guides..."
                className="w-full pl-14 pr-12 py-4 text-md text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent font-normal"
              />
              <button
                onClick={() => {
                  if (query) {
                    setQuery("");
                    setResults([]);
                    inputRef.current?.focus();
                  } else {
                    setIsOpen(false);
                  }
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-all"
              >
                <FaTimes />
              </button>
            </div>

            {/* CONTENT BODY (Scrollable) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
              {/* STATE: DEFAULT (Recent + Featured) */}
              {!query && (
                <>
                  {recent.length > 0 && (
                    <div className="mb-2">
                      <div className="flex justify-between items-center px-5 py-2">
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                          Recent
                        </h4>
                        <button
                          onClick={clearAllRecent}
                          className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase"
                        >
                          Clear
                        </button>
                      </div>

                      {recent.map((item, index) => (
                        <div
                          key={item}
                          onClick={() => handleSelect(item)}
                          className={`group px-5 py-2.5 flex items-center justify-between cursor-pointer transition-colors
                              ${
                                selectedIndex === index
                                  ? "bg-gray-100"
                                  : "hover:bg-gray-50"
                              }`}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <FaHistory
                              className={`shrink-0 text-sm ${
                                selectedIndex === index
                                  ? "text-gray-800"
                                  : "text-gray-400"
                              }`}
                            />
                            <span className="text-gray-700 text-sm font-medium truncate group-hover:text-black">
                              {item}
                            </span>
                          </div>
                          <button
                            onClick={(e) => removeRecent(e, item)}
                            className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                          >
                            <FaTimes size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-2">
                    <h4 className="px-5 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Suggested
                    </h4>
                    {featuredPlaces.map((place, index) => {
                      const actualIndex = recent.length + index;
                      return (
                        <div
                          key={place}
                          onClick={() => handleSelect(place)}
                          className={`px-5 py-3 flex items-center cursor-pointer transition-colors
                              ${
                                selectedIndex === actualIndex
                                  ? "bg-gray-100"
                                  : "hover:bg-gray-50"
                              }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center mr-3 transition-colors shrink-0
                              ${
                                selectedIndex === actualIndex
                                  ? "bg-gray-800 text-white"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                          >
                            <FaMountain size={10} />
                          </div>
                          <span className="text-gray-700 text-sm font-semibold">
                            {place}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* STATE: RESULTS */}
              {query && results.length > 0 && (
                <div className="py-1">
                  <h4 className="px-5  text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Results
                  </h4>
                  <ul>
                    {results.map((item, index) => (
                      <li
                        key={index}
                        onClick={() => handleSelect(item)}
                        className={`px-5 py-3 flex items-center cursor-pointer transition-colors
                            ${
                              selectedIndex === index
                                ? "bg-gray-100"
                                : "hover:bg-gray-50"
                            }`}
                      >
                        <div
                          className={`mr-3.5 ${
                            selectedIndex === index
                              ? "text-gray-800"
                              : "text-gray-400"
                          }`}
                        >
                          {featuredPlaces.includes(item) ? (
                            <FaMapMarkerAlt size={14} />
                          ) : (
                            <FaArrowRight size={12} />
                          )}
                        </div>
                        <div className="text-sm text-gray-700">
                          <HighlightText text={item} highlight={query} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* STATE: NO RESULTS */}
              {query && results.length === 0 && (
                <div className="px-4 py-10 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <p className="text-gray-900 font-medium text-sm">
                    No results found
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    No match for "{query}".
                  </p>
                </div>
              )}
            </div>

            {/* FOOTER (Fixed) */}
            <div className="flex-none bg-gray-50 px-5 py-2.5 border-t border-gray-200 flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-wide">
              <span className="font-bold text-gray-400">Search</span>
              <div className="items-center gap-3 hidden sm:flex">
                <span className="flex items-center gap-1.5">
                  <span className="bg-white border border-gray-200 rounded px-1.5 py-0.5 shadow-sm font-bold">
                    ↑↓
                  </span>
                  <span>navigate</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="bg-white border border-gray-200 rounded px-1.5 py-0.5 shadow-sm font-bold">
                    ↵
                  </span>
                  <span>select</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="bg-white border border-gray-200 rounded px-1.5 py-0.5 shadow-sm font-bold">
                    esc
                  </span>
                  <span>close</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Searchbar;
