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
      id: "inventory",
      label: "Inventory",
      icon: "/inventory.svg",
      href: "/admin/inventory",
    },
    {
      id: "ordersList",
      label: "Orders",
      icon: "/orderList.svg",
      href: "/admin/orders",
    },
  ];

  return (
    <aside className="w-64 fixed top-20 left-0 h-[calc(100vh-80px)] overflow-y-auto border-r border-gray-200 py-6 bg-white shadow-lg z-[9998]">
      <div className="px-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 tracking-wide">
          Admin Panel
        </h2>
        <div className="w-12 h-1 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full mt-2"></div>
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
                    ? "border-r-[5px] border-gray-500 bg-gray-50 text-gray-700 shadow-sm"
                    : "border-r-[5px] border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <img
                  src={item.icon}
                  className={`w-5 h-5 transition-colors ${
                    isActive ? "opacity-90" : "opacity-70"
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
