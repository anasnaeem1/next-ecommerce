"use client";
import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { UserType } from "@/types";

export type NavLinksTypes =
  | {
      user: UserType;
      userLoaded: boolean;
    }
  | any;

const NavLinks = () => {
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
              className="text-md font-medium text-gray-800 hover:text-gray-600 hover:underline underline-offset-4 transition-color duration-300 tracking-wider"
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
