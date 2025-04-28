"use client";
import { useContext, useState } from "react";
import CartDropdown from "./CartDropdown";
import { useRouter } from "next/navigation";
import { useClerk, UserButton } from "@clerk/nextjs";
import { UserContext } from "../../context/UserContext";
import { CartIcon } from "../../assets/assets.js";

type DropDownItem = {
  id: string;
  label: string;
  link: string;
};

export type UserType =
  | {
      id: string;
      name: string;
      email: string;
    }
  | any;

const NavIcons = () => {
  const [openIconId, setOpenIconId] = useState<string | null>(null);
  const router = useRouter();
  const { openSignIn, signOut } = useClerk();
  const { user: currentUser } = useContext(UserContext) as { user: UserType };

  const navIcons = [
    {
      id: "notificationIcon",
      icon: "/notification.png",
      disable: true,
      dropDown: [
        { label: "Profile", link: "/profile" },
        { label: "Logout", link: "/" },
      ],
    },
    {
      id: "cartIcon",
      icon: "/cart.png",
      disable: true,
      dropDown: [
        { label: "Profile", link: "/profile" },
        { label: "Logout", link: "/" },
      ],
    },
  ];

  const profileDropDown: DropDownItem[] = [
    { id: "forProfile", label: "Profile", link: "/profile" },
    { id: "forLogout", label: "Logout", link: "/" },
  ];

  const HandleDropdown = (id: string) => {
    if (openIconId === id) {
      setOpenIconId(null);
    } else {
      setOpenIconId(id);
    }
  };

  const handlelogout = () => {
    signOut();
    localStorage.removeItem("user");
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {navIcons.map((navIcon) => (
        <div
          key={navIcon.id}
          className="relative  w-[25px] h-[25px] flex items-center justify-center"
        >
          <img
            src={navIcon.icon}
            className="w-full cursor-pointer h-full rounded-full"
            alt="navicon"
            onClick={() =>
              navIcon.id === "profileIcon"
                ? openSignIn()
                : HandleDropdown(navIcon.id)
            }
          />

          {/* Notification Badge */}
          {navIcon.id === "notificationIcon" && (
            <div className="absolute opacity-85 -top-2 -right-2 bg-[#f52493] text-white text-[11px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-lg shadow-pink-400/60 ring-2 ring-white">
              2
            </div>
          )}
          {/* Dropdown Menu */}
          {openIconId === navIcon.id && (
            <div className="absolute z-10 top-8 -left-4 bg-white shadow-lg rounded-lg p-2">
              {navIcon.id === "cartIcon" ? <CartDropdown /> : null}
            </div>
          )}
        </div>
      ))}
      {currentUser ? (
        <div className="mt-2" onClick={() => setOpenIconId(null)}>
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="Cart"
                labelIcon={<CartIcon />}
                onClick={() => router.push("/cart")}
              />
            </UserButton.MenuItems>
          </UserButton>
        </div>
      ) : (
        <div className="relative  w-[25px] h-[25px] flex items-center justify-center">
          <img
            src="profile.png"
            className="w-full cursor-pointer h-full rounded-full"
            alt="navicon"
            onClick={() => openSignIn()}
          />
        </div>
      )}
    </div>
  );
};
export default NavIcons;
