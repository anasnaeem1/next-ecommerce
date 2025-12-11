"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname() || "";


  return (
    <div className="flex h-[calc(100vh-80px)] bg-white">
      <aside className="sidebar h-full w-64 py-4 border-r border-gray-300">
        <h2 className="ml-3 text-lg font-semibold text-gray-700 mb-5">
          Admin Panel
        </h2>
      </aside>

      <main className=" flex-1 p-10 h-full">{children}</main>
    </div>
  );
}
