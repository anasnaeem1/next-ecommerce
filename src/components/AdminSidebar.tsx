"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminSidebar = () => {
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
    <aside className="w-64 fixed top-20 left-0 h-[calc(100vh-80px)] overflow-y-auto border-r border-slate-300 py-6 bg-slate-50 shadow-sm z-[9998]">
      <div className="px-6 mb-8">
        <h2 className="text-xl font-bold text-slate-800 tracking-wide">
          Admin Panel
        </h2>
        <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-indigo-300 rounded-full mt-2"></div>
      </div>
      <ul className="space-y-1 px-3">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                className={`flex items-center px-4 gap-4 py-4 text-sm font-medium rounded-lg mx-2 transition-all duration-200 ${
                  isActive
                    ? "border-r-[4px] border-indigo-500 bg-indigo-50/70 text-indigo-700 shadow-sm"
                    : "border-r-[4px] border-transparent text-slate-600 hover:bg-white hover:text-slate-800"
                }`}
              >
                <img
                  src={item.icon}
                  className={`w-5 h-5 transition-colors ${
                    isActive ? "opacity-100" : "opacity-70"
                  }`}
                  alt={item.label}
                />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default AdminSidebar;
