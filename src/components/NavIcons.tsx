"use client";
import { useContext, useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useClerk, UserButton, useUser } from "@clerk/nextjs";
import { UserContext } from "../../context/UserContext";
import { CartIcon } from "../../assets/assets.js";

const NavIcons = () => {
  const [openIconId, setOpenIconId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { openSignIn, signOut } = useClerk();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { user: currentUser } = useContext(UserContext) as { user: any };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render nothing until client is ready
    return null;
  }

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

  const HandleDropdown = (id: string) => {
    setOpenIconId(openIconId === id ? null : id);
  };

  const handleCartClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("viewCart", "true");
    // Update URL with the new params without navigating away
    router.push(`${pathname}?${params.toString()}`);
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
          className="relative w-[25px] h-[25px] flex items-center justify-center"
        >
          <img
            src={navIcon.icon}
            className="w-full cursor-pointer h-full rounded-full"
            alt="navicon"
            onClick={() => {
              if (navIcon.id === "profileIcon") {
                openSignIn();
              } else if (navIcon.id === "cartIcon") {
                handleCartClick();
              } else {
                HandleDropdown(navIcon.id);
              }
            }}
          />

          {navIcon.id === "notificationIcon" && (
            <div className="absolute opacity-85 -top-2 -right-2 bg-gray-600 text-white text-[11px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-lg shadow-gray-400/60 ring-2 ring-white">
              2
            </div>
          )}

          {openIconId === navIcon.id && navIcon.id !== "cartIcon" && (
            <div className="absolute z-10 top-8 -left-4 bg-white shadow-lg rounded-lg p-2">
              {/* Dropdown content for other icons */}
            </div>
          )}
        </div>
      ))}

      {clerkLoaded && (clerkUser || currentUser) ? (
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
        <div className="relative w-[25px] h-[25px] flex items-center justify-center">
          <img
            src="profile.png"
            className="w-full cursor-pointer h-full rounded-full"
            alt="navicon"
            onClick={() => {
              // Only open sign-in if user is not signed in
              if (!clerkUser && clerkLoaded) {
                openSignIn();
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default NavIcons;
