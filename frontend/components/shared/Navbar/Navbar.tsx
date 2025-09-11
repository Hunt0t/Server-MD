
"use client";
import Link from "next/link";
import Container from "../Container/Container";
import { useState, useEffect, useRef } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="bg-white shadow-sm h-[80px] fixed top-0 left-0 w-full z-50">
      <Container className="flex justify-between items-center h-[80px] font-sans">
        {/* logo */}
        <div>
          <Link
            href={"/"}
            className="uppercase font-mono text-[28px] md:text-[32px] cursor-pointer"
          >
            promaxs
          </Link>
        </div>

        {/* middle text (hide on small & medium) */}
      

        {/* desktop menu */}
        <div className="hidden lg:flex items-center gap-5">
          <Link
            className="text-[16px] font-medium hover:text-red-400 duration-300 ease-in-out"
            href={"/login"}
          >
            Login
          </Link>
          <Link
            className="text-[16px] font-medium hover:text-red-400 duration-300 ease-in-out"
            href={"/register"}
          >
            Register
          </Link>
          <Link
            className="text-[16px] font-medium hover:text-red-400 duration-300 ease-in-out"
            href={"/about"}
          >
            About
          </Link>
          <Link
            className="text-[16px] font-medium hover:text-red-400 duration-300 ease-in-out"
            href={"/contact"}
          >
            Contact
          </Link>
        </div>

        {/* mobile & medium menu icon */}
        <div className="lg:hidden">
          <button onClick={() => setIsOpen(true)}>
            <FiMenu size={28} />
          </button>
        </div>
      </Container>

      {/* Sidebar for mobile & medium */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
        ref={sidebarRef}
      >
        {/* close button */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-mono text-xl">PROMAXS</h2>
          <button onClick={() => setIsOpen(false)}>
            <FiX size={26} />
          </button>
        </div>

        {/* menu items */}
        <div className="flex flex-col gap-6 p-6 text-[16px] font-medium">
          <Link
            href={"/login"}
            onClick={() => setIsOpen(false)}
            className="hover:text-red-400 duration-300"
          >
            Login
          </Link>
          <Link
            href={"/signup"}
            onClick={() => setIsOpen(false)}
            className="hover:text-red-400 duration-300"
          >
            Register
          </Link>
          <Link
            href={"/about"}
            onClick={() => setIsOpen(false)}
            className="hover:text-red-400 duration-300"
          >
            About
          </Link>
          <Link
            href={"/contact"}
            onClick={() => setIsOpen(false)}
            className="hover:text-red-400 duration-300"
          >
            Contact
          </Link>
        </div>
      </div>

      {/* overlay (close when clicked) */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40"></div>
      )}
    </div>
  );
};

export default Navbar;
