import { ReactNode } from "react";
import AdminSidebar from "../../components/AdminSidebar";

type AdminLayoutProps = { children: ReactNode };

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <>
      <div className="flex w-full overflow-hidden bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-8 ml-64">{children}</main>
      </div>
    </>
  );
}
