"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type AdminLayoutProps = { children: ReactNode };

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname() || "";

  const menuItems = [
    {
      id: "addProduct",
      label: "Add Product",
      icon: "/addIcon.svg",
      href: "/admin/products",
    },
    {
      id: "productList",
      label: "Product List",
      icon: "/listIcon.svg",
      href: "/admin/collections",
    },
    {
      id: "ordersList",
      label: "Orders",
      icon: "/orderList.svg",
      href: "/admin/orders",
    },
  ];

  return (
    <div className="flex h-[calc(100vh-80px)] bg-white">
      <aside className="sidebar h-full w-64 py-4 border-r border-gray-300">
        <h2 className="ml-3 text-lg font-semibold text-gray-700 mb-5">
          Admin Panel
        </h2>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center text-black px-4 gap-3 py-4 text-md transition
                    ${
                      isActive
                        ? " border-r-[5px] border-pink-500 bg-pink-50"
                        : " border-r-[5px] border-transparent text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  <img src={item.icon} className="w-6 h-6" alt={item.label} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>

      <main className=" flex-1 p-10 h-full">{children}</main>
    </div>
  );
}
