import { Bell, Search } from "lucide-react";
import React from "react";

const Topbar = () => {
  return (
    <div className="bg-[#06102c] rounded-b-2xl shadow-sm border-b">
      <div className="px-4 sm:px-6 md:px-8 py-3 md:py-4">
        {/* Row 1: Logo and Icons (mobile) */}
        <div className="flex justify-between items-center md:hidden mb-3">
          <h1 className="text-lg font-semibold text-white">Xrow</h1>
          <div className="flex text-white gap-5 items-center">
            <Bell size={20} />
            <span className="bg-gray-400 py-1.5 px-2 font-semibold rounded-sm text-[#06102c]">
              AB
            </span>
          </div>
        </div>

        {/* Main layout: switches between stacked (mobile) and horizontal (tablet/desktop) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo - hidden on mobile (shown above), visible on tablet/desktop */}
          <h1 className="hidden md:block text-lg font-semibold text-white flex-shrink-0">
            Xrow
          </h1>

          {/* Search Bar - full width on mobile, auto width on tablet/desktop */}
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 text-white focus-within:bg-white/20 transition-all w-full md:w-auto md:min-w-[300px] lg:min-w-[400px] xl:min-w-[500px]">
            <Search className="w-4 h-4 opacity-70 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none placeholder:text-white/50 flex-1 min-w-0"
            />
          </div>

          {/* Icons - visible on tablet/desktop only */}
          <div className="hidden md:flex text-white gap-5 items-center flex-shrink-0">
            <Bell size={20} />
            <span className="bg-gray-400 py-1.5 px-2 font-semibold rounded-sm text-[#06102c]">
              AB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
