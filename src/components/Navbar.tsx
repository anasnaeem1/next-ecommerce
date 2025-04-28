"use client";
import Link from "next/link";
import Switch from "./Switch";
import Search from "./Search";
import NavIcons from "./NavIcons";
import NavLinks from "./NavLinks";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname() || "";
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      <div
        className={`${
          isAdminRoute ? "px-3" : "px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64"
        } bg-white w-full z-[9999] border-b border-gray-200 flex justify-between items-center h-20  `}
      >
        {/* Logo */}
        <div className="flex items-center gap-12">
          <Link href="/" className="">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                className="w-7 h-7 rounded-full"
                alt="logo"
              />
              <h1 className="uppercase self-start text-2xl font-semibold tracking-wide">
                Urban
              </h1>
            </div>
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
          <button className=" px-7 py-3 text-sm bg-gray-800 text-white rounded-full shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 transition-colors duration-200">
            Logout
          </button>
        )}
      </div>
    </>
  );
};
export default Navbar;
