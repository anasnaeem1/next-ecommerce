"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "../../components/AdminSidebar";

type AdminLayoutProps = { children: ReactNode };

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  // detect exact /admin only
  const isAdminHome = pathname === "/admin";

  // detect sub routes like /admin/products, /admin/orders, etc.
  const isAdminSubRoute =
    pathname.startsWith("/admin/") && pathname !== "/admin";

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      {/* SIDEBAR ONLY ON /admin */}
      {isAdminHome && (
        <div className="hidden md:block">
          <AdminSidebar />
        </div>
      )}

      {/* MAIN */}
      <main
        className={`flex-1 overflow-y-auto p-6 md:p-8 transition-all duration-300 ${
          isAdminHome ? "md:ml-64" : "ml-0"
        }`}
      >
        {children}
      </main>
    </div>
  );
}