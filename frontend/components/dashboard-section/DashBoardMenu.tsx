

"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import {
  useLogoutUserMutation,
} from "@/app/redux/api/auth/authApi";
import { useAppDispatch } from "@/app/redux/featuers/hooks";
import { logout } from "@/app/redux/api/auth/authSlice";


export default function DashBoardMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();

//   const { data: userData, isLoading } = useGetMeQuery(undefined, {
//     refetchOnMountOrArgChange: true,
//   });

    const [logoutUser] = useLogoutUserMutation();
   
     const handleLogout = async () => {
       try {
         await logoutUser("").unwrap();
         dispatch(logout());
   
         Object.keys(localStorage).forEach((key) => {
           if (key === "isDataVisible" || key === "persist:auth") {
             localStorage.removeItem(key);
           }
         });
   
         sessionStorage.clear();
         document.cookie.split(";").forEach((cookie) => {
           const [name] = cookie.split("=");
           document.cookie = `${name.trim()}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
         });
   
         router.push("/login");
       } catch (error) {
         console.error("Logout failed:", error);
       }
     };
  


  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const links = [
    { name: "Data Manage", href: "/dashboard/orders-manage" },
    { name: "Al lUser Manage", href: "/dashboard/all-user-manage" },
    { name: "All Contacts", href: "/dashboard/all-contacts" },
    { name: "Announcements", href: "/dashboard/announcement" },
    { name: "Payment History", href: "/dashboard/payment-history" },
    { name: "Settings", href: "/dashboard/settings" },
  ];


  return (
    <nav className="w-full shadow-md relative">
      {/* Top Red Banner */}
      <div className="bg-red-600 hidden text-white text-center py-2 text-sm font-medium">
       
        website <span className="font-bold">promaxs.com</span>
      </div>

      {/* Main Navbar */}
      <div className="flex items-center justify-between px-4 md:px-10 py-3 bg-white">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-400">
          <Link href={"/dashboard/orders-manage"}>
            {" "}
            P<span className="text-sky-600">ROMAXS</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex gap-6 text-gray-600 font-medium">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`pb-1 border-b-2 transition-colors ${
                  pathname === link.href
                    ? "border-blue-500 text-blue-500"
                    : "border-transparent hover:text-blue-500 hover:border-blue-500"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Section (Desktop) */}
        <div className="hidden lg:flex items-center gap-4">
           <button
          className="rounded-[6px] px-6 py-3 text-white text-[14px] text-center bg-red-500 font-medium leading-[18px] cursor-pointer flex items-end justify-center"
          onClick={handleLogout}
        >
         Logout
        </button>
        </div>

        {/* Hamburger Button */}
        <button
          onClick={() => setMenuOpen(true)}
          className="lg:hidden text-gray-600"
        >
          <Menu size={26} />
        </button>
      </div>

      {/* Overlay + Sidebar */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Sidebar */}
        <div
          ref={menuRef}
          className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="text-xl font-bold text-blue-400">
              SSN<span className="text-sky-600">PRO</span>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Mobile Menu */}
          <ul className="flex flex-col gap-4 p-4 text-gray-600 font-medium">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block pb-1 border-b-2 transition-colors ${
                    pathname === link.href
                      ? "border-blue-500 text-blue-500"
                      : "border-transparent hover:text-blue-500 hover:border-blue-500"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

        
        </div>
      </div>
    </nav>
  );
}
