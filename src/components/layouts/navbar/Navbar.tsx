import React from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
  // Updated navItems to match your App.js routes
  const navItems = [
    { label: "Explore", path: "/" },
    { label: "Tour & Activities", path: "/tour&activities" },
    { label: "Plan a Trip", path: "/plan-trips" },
    { label: "Packages", path: "/packages" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <nav className="flex items-center m-4 px-6 py-3 bg-white border border-gray-200 shadow-md rounded-xl">
      <div className="flex items-center flex-1">
        <Link to="/">
          <img
            src="/assets/logo.png"
            alt="Mount Treks Logo"
            className="h-14 w-auto cursor-pointer"
          />
        </Link>
      </div>

      <div className="flex gap-1 items-center justify-center">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `cursor-pointer transition-colors duration-200 font-bold text-sm tracking-wide px-5 py-2.5 rounded-lg flex items-center
              ${
                isActive
                  ? "text-black bg-zinc-100" // Active state style
                  : "text-zinc-600 hover:text-black hover:bg-zinc-50" // Inactive state style
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center justify-end gap-5 flex-1">
        <button className="text-xs font-extrabold text-zinc-950 hover:text-zinc-600 transition-colors px-2 uppercase tracking-wide">
          Log in
        </button>

        <button className="rounded-full bg-black text-white px-6 py-2.5 text-xs font-bold shadow-lg shadow-zinc-200 hover:bg-zinc-800 hover:shadow-xl transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400">
          Sign up
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
