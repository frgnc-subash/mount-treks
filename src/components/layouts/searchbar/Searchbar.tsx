import React, { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

interface SearchbarProps {
  containerClassName?: string;
}

const Searchbar: React.FC<SearchbarProps> = ({ containerClassName }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const featuredPlaces = ["Tokyo", "New York", "London"];
  const items = [
    "Home",
    "About Us",
    "Services",
    "Contact",
    "Blog",
    "Careers",
    "Pricing",
    "FAQ",
    "Tokyo",
    "New York",
    "London",
  ];

  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) setRecent(JSON.parse(stored));
  }, []);

  const addToRecent = (item: string) => {
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setQuery("");
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`relative w-full ${containerClassName ?? "max-w-md"} mx-auto`}
      ref={containerRef}
    >
      <div
        className="w-full border border-gray-400 rounded-full px-4 py-3 flex items-center cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <FaSearch className="text-gray-500 mr-3" />
        <span className="text-gray-500">Search...</span>
      </div>

      {isOpen && (
        <div
          className="absolute top-0 left-0 w-full z-50"
          style={{ minWidth: containerRef.current?.offsetWidth }}
        >
          <div className="bg-white border border-gray-400 rounded-xl shadow-lg">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-base" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-12 pr-4 py-3 text-base border-b border-gray-300 focus:outline-none rounded-t-xl"
                autoFocus
              />
            </div>

            <div className="max-h-72 overflow-y-auto">
              {!query && (
                <div className="p-3">
                  <h4 className="text-xs font-semibold text-gray-500 mb-1">
                    Featured Places
                  </h4>
                  {featuredPlaces.map((place, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm rounded-md"
                      onClick={() => {
                        setQuery(place);
                        addToRecent(place);
                        setIsOpen(false);
                      }}
                    >
                      {place}
                    </div>
                  ))}
                </div>
              )}

              {!query && recent.length > 0 && (
                <div className="p-3 border-t border-gray-200">
                  <h4 className="text-xs font-semibold text-gray-500 mb-1">
                    Recent Searches
                  </h4>
                  {recent.map((item, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm rounded-md"
                      onClick={() => {
                        setQuery(item);
                        addToRecent(item);
                        setIsOpen(false);
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}

              {query && results.length > 0 && (
                <ul>
                  {results.map((item, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => {
                        setQuery(item);
                        addToRecent(item);
                        setIsOpen(false);
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {query && results.length === 0 && (
                <p className="px-4 py-3 text-sm text-gray-500 text-center">
                  No results found
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Searchbar;
