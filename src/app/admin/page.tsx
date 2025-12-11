"use client";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { UserContext } from "../../../context/UserContext";
import { UserType } from "@/types";

export default function AdminHomePage() {
  // const pathname = usePathname() || "";
  const { user: currentUser, userLoaded } = useContext(UserContext);
  console.log(currentUser);
  // const isAdminRoute = pathname.startsWith("/admin");
  const router = useRouter();

  useEffect(() => {
    if (userLoaded && !currentUser) {
      router.push(`/`);
    }
  }, [userLoaded, currentUser]);

  return (
    <div className="text-gray-700 text-base">
      <h1 className="text-2xl font-bold mb-4">
        Welcome to the Admin Dashboard
      </h1>
      <p>Select an item from the sidebar to get started.</p>
    </div>
  );
}
