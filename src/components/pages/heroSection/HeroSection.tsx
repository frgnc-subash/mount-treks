import { useState, useEffect } from "react";
import { FaMountain, FaRegMap, FaStar, FaArrowDown } from "react-icons/fa";
import Navbar from "../../layouts/navbar/Navbar";
import Searchbar from "../../layouts/searchbar/Searchbar";
import Footer from "@/components/layouts/footer/Footer";
import Showcase from "./Showcase";

const HeroSection = () => {
  const backgroundImages = [
    "/assets/bg1.webp",
    "/assets/bg2.webp",
    "/assets/bg3.webp",
    "/assets/bg4.webp",
    "/assets/bg5.webp",
    "/assets/bg6.webp",
    "/assets/bg7.webp",
    "/assets/bg8.webp",
    "/assets/bg9.jpg",
    "/assets/bg10.jpg",
    "/assets/bg11.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="relative w-full h-screen min-h-[700px] flex flex-col font-sans">
        {/* --- BACKGROUND CAROUSEL START --- */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          {backgroundImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={img}
                alt={`Slide ${index}`}
                className="w-full h-full object-cover select-none brightness-[0.7]"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-linear-to-b from-black/5 via-black/70 to-[#050505] z-10" />
        </div>
        {/* --- BACKGROUND CAROUSEL END --- */}

        <div className="relative z-20 grow flex flex-col items-center justify-center px-4 pt-24 text-center">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            <span className="text-white text-xs font-bold tracking-widest uppercase">
              Visit Nepal 2026
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.1] mb-6 drop-shadow-2xl">
            CONQUER <br />
            <span className="text-transparent bg-clip-text bg-linear-to-b from-white to-zinc-400">
              THE HIMALAYAS
            </span>
          </h1>

          <p className="text-zinc-200 text-lg md:text-xl max-w-xl mb-10 leading-relaxed font-light drop-shadow-md">
            From the streets of Kathmandu to the summit of Everest. We craft
            journeys that define a lifetime.
          </p>

          <div className="w-full max-w-2xl mx-auto">
            <Searchbar containerClassName="shadow-2xl shadow-black/50" />
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-zinc-400 font-medium">
            <span>Trending:</span>
            <button className="hover:text-white hover:underline decoration-[#084EA8] underline-offset-4 transition-all">
              Everest Base Camp
            </button>
            <button className="hover:text-white hover:underline decoration-[#084EA8] underline-offset-4 transition-all">
              Annapurna Circuit
            </button>
            <button className="hover:text-white hover:underline decoration-[#084EA8] underline-offset-4 transition-all">
              Mustang
            </button>
          </div>
        </div>

        <div className="relative z-10 w-full border-t border-white/10 bg-black/40 backdrop-blur-md hidden md:block">
          <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-3 gap-8 text-white">
            <div className="flex items-center gap-4 justify-center border-r border-white/10">
              <FaMountain className="text-[#084EA8] text-2xl" />
              <div className="text-left">
                <p className="font-bold text-lg">1,200+</p>
                <p className="text-xs text-zinc-400 uppercase tracking-wider">
                  Successful Climbs
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center border-r border-white/10">
              <FaRegMap className="text-[#084EA8] text-2xl" />
              <div className="text-left">
                <p className="font-bold text-lg">50+</p>
                <p className="text-xs text-zinc-400 uppercase tracking-wider">
                  Unique Routes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <FaStar className="text-[#084EA8] text-2xl" />
              <div className="text-left">
                <p className="font-bold text-lg">4.9/5</p>
                <p className="text-xs text-zinc-400 uppercase tracking-wider">
                  Traveler Rating
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 animate-bounce md:hidden z-10">
          <FaArrowDown />
        </div>
      </div>
      <Showcase />
      <Footer />
    </div>
  );
};

export default HeroSection;
