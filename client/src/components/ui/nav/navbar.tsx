import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full shadow-md py-4">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img 
            src="/logo.png"
            alt="ClickSafe logo"
            className="w-42 h-auto object-contain"
          />
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link to={'/docs'} className=" cursor-pointer px-8 py-3 bg-linear-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105">
            Start Free Trial
          </Link>
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-800 focus:outline-none"
          >
            {isOpen ? (
              <HiX className="w-6 h-6" />
            ) : (
              <HiMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden px-6 pt-4 pb-6 flex flex-col space-y-4 bg-black shadow-md">
          <Link to="/docs" className=" px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105">
            Start Free Trial
          </Link>
        </div>
      )}
    </nav>
  );
}
