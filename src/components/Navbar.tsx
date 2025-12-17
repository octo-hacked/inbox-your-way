import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fda5f8811416846e891b7362c61b366cb%2F556c038b85e942c2b15d53e3710e039f?format=webp&width=800"
            alt="LockedIn Logo"
            className="h-7 sm:h-8"
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2 lg:gap-6">
          <Link to="/" className="text-white hover:text-gray-300 text-xs sm:text-sm">
            Home
          </Link>
          <a href="#about" className="text-white hover:text-gray-300 text-xs sm:text-sm">
            About Us
          </a>
          <Link to="/signin">
            <Button variant="ghost" className="text-white hover:text-gray-300 h-8 text-xs sm:text-sm px-2 sm:px-4">
              Log in
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-red-600 hover:bg-red-700 h-8 text-xs sm:text-sm px-3 sm:px-4">
              Create Account
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black border-t border-gray-800 px-4 py-4 space-y-3">
          <Link
            to="/"
            className="block text-white hover:text-gray-300 text-sm py-2"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <a
            href="#about"
            className="block text-white hover:text-gray-300 text-sm py-2"
            onClick={() => setIsOpen(false)}
          >
            About Us
          </a>
          <Link
            to="/signin"
            className="block text-white hover:text-gray-300 text-sm py-2"
            onClick={() => setIsOpen(false)}
          >
            Log in
          </Link>
          <Link to="/signup" onClick={() => setIsOpen(false)}>
            <Button className="w-full bg-red-600 hover:bg-red-700 text-sm">
              Create Account
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
};
