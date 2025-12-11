import { ReactNode } from "react";
import AdminSidebar from "../../components/AdminSidebar"

type AdminLayoutProps = { children: ReactNode };

export default function AdminLayout({ children }: AdminLayoutProps) {


  return (
    <div className="flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar/>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8 ml-64">{children}</main>
    </div>
  );
}
