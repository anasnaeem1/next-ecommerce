"use client";
import Link from "next/link";
import Switch from "./Switch";
import Search from "./Search";
import NavIcons from "./NavIcons";
import NavLinks from "./NavLinks";
import Logo from "./Logo";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname() || "";
  const isAdminRoute = pathname.startsWith("/admin");
  const isCheckoutRoute = pathname.startsWith("/checkout");

  if (isCheckoutRoute) {
    return null;
  }

  return (
    <>
      <div
        className={`sticky top-0 w-full z-[9999] ${
          isAdminRoute 
            ? "bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-300 shadow-sm" 
            : "bg-white border-b border-gray-200"
        } h-20 flex justify-between items-center
        ${isAdminRoute ? "px-6" : "px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64"}
      `}
      >
        {/* Logo */}
        <div className="flex items-center gap-12">
          <Link href={isAdminRoute ? "/admin" : "/"} className="hover:opacity-80 transition-opacity duration-200">
            <Logo isAdmin={isAdminRoute} />
          </Link>
          {!isAdminRoute && <NavLinks />}
        </div>

        {!isAdminRoute && (
          <div className="md:flex hidden gap-3 items-center">
            <div className="w-full max-w-[300px]">
              <Search />
            </div>
            <NavIcons />
          </div>
        )}

        {!isAdminRoute && (
          <div className="md:hidden flex">
            <Switch />
          </div>
        )}

        {isAdminRoute && (
          <div className="flex items-center gap-4">
            {/* Go to home button */}
            <Link href="/" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors duration-200 cursor-pointer">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Go to home</span>
            </Link>
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-200 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Admin</span>
            </div>
            
            {/* Logout button */}
            <button className="px-6 py-2.5 text-sm bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 hover:shadow-lg">
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Exit</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};
export default Navbar;
