"use client";
import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { UserType } from "@/types";
import { usePathname } from "next/navigation";

export type NavLinksTypes =
  | {
      user: UserType;
      userLoaded: boolean;
    }
  | any;

const NavLinks = () => {
  const pathname = usePathname();

  const { user: currentUser, userLoaded } = useContext(
    UserContext
  ) as NavLinksTypes;

  const navLinks = [
    { id: "home", label: "Home", link: "/" },
    { id: "shop", label: "Shop", link: "/list" },
    { id: "about", label: "About", link: "/about" },
    { id: "contact", label: "Contact", link: "/contact" },
    { id: "admin", label: "Admin", link: "/admin" },
  ];

  return (
    <ul className="hidden gap-6 lg:flex">
      {navLinks.map((link) => (
        <li key={link.id}>
          {userLoaded && !currentUser && link.id === "admin" ? (
            ""
          ) : (
            
            <Link
            href={link.link}
            className={`relative inline-block text-md font-medium transition-colors duration-300 after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-1 after:h-[2px] after:bg-black after:transition-all after:duration-300 ${
              pathname === link.link
                ? "text-gray-900 after:w-full"
                : "text-gray-700 hover:text-gray-900 after:w-0 hover:after:w-full"
            }`}
          >
            {link.label}
          </Link>
          )}
        </li>
      ))}
    </ul>
  );
};

export default NavLinks;
