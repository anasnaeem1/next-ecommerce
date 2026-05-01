"use client";
import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import Search from "./Search";
import NavIcons from "./NavIcons";
import NavLinks from "./NavLinks";
import Logo from "./Logo";
import { usePathname } from "next/navigation";
import { UserContext } from "../../context/UserContext";

const MOBILE_NAV_LINKS = [
  { id: "home", label: "Home", link: "/" },
  { id: "shop", label: "Shop", link: "/list" },
  { id: "about", label: "About", link: "/about" },
  { id: "contact", label: "Contact", link: "/contact" },
  { id: "admin", label: "Admin", link: "/admin" },
] as const;

function MobileNavDropdown({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user: currentUser, userLoaded } = useContext(UserContext) as {
    user: unknown;
    userLoaded: boolean;
  };

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        className="fixed inset-0 z-[9998] bg-black/40 lg:hidden"
        onClick={onClose}
      />
      <div
        id="mobile-nav-dropdown"
        role="menu"
        aria-label="Mobile navigation"
        className=" absolute right-0 top-[calc(100%+0.5rem)] z-[9999] w-[min(calc(100vw-2rem),20rem)] rounded-lg border border-gray-200 bg-white py-4 shadow-xl lg:hidden"
      >
        <nav className=" flex flex-col gap-1 px-2">
          {MOBILE_NAV_LINKS.map((item) =>
            userLoaded && !currentUser && item.id === "admin" ? null : (
              <Link
                key={item.id}
                href={item.link}
                role="menuitem"
                onClick={onClose}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>
        <div className="mt-2 border-t border-gray-100 px-4 pt-4">
          <Search />
        </div>
        <div className="mt-4 flex justify-center border-t border-gray-100 px-4 pt-4">
          <NavIcons />
        </div>
      </div>
    </>
  );
}

/** Top bar for /admin routes — co-located with `Navbar`; used only on admin paths from `Navbar`. */
export function AdminNav() {
  return (
    <div
      className="sticky top-0 w-full z-[9999] bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-300 shadow-sm h-20 flex justify-between items-center px-6"
    >
      <div className="flex items-center gap-12">
        <Link href="/admin" className="hover:opacity-80 transition-opacity duration-200">
          <Logo isAdmin />
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors duration-200 cursor-pointer"
        >
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700">Go to home</span>
        </Link>

        <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-200 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-sm font-medium text-gray-700">Admin</span>
        </div>

        <button
          type="button"
          suppressHydrationWarning
          className="px-6 py-2.5 text-sm bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 hover:shadow-lg"
        >
          <span className="hidden sm:inline">Logout</span>
          <span className="sm:hidden">Exit</span>
        </button>
      </div>
    </div>
  );
}

const Navbar = () => {
  const pathname = usePathname() || "";
  const isAdminRoute = pathname.startsWith("/admin");
  const isCheckoutRoute = pathname.startsWith("/checkout");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileMenuOpen]);

  if (isCheckoutRoute) {
    return null;
  }

  if (isAdminRoute) {
    return <AdminNav />;
  }

  return (
    <>
      <div className="sticky top-0 w-full z-[9999] bg-white border-b border-gray-200 h-20 flex justify-between items-center px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <div className="flex items-center gap-12">
          <Link href="/" className="hover:opacity-80 transition-opacity duration-200">
            <Logo isAdmin={false} />
          </Link>
          <NavLinks />
        </div>

        <div className="lg:flex hidden gap-3 items-center">
          <div className="w-full max-w-[300px]">
            <Search />
          </div>
          <NavIcons />
        </div>

        <div className="lg:hidden relative">
          <button
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-dropdown"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="flex h-12 w-12 flex-col items-center justify-center gap-1 rounded-full hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
          >
            <span
              className={`block h-0.5 w-5 rounded-full bg-gray-800 transition-transform duration-200 ${
                mobileMenuOpen ? "translate-y-[5px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-gray-800 transition-opacity duration-200 ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded-full bg-gray-800 transition-transform duration-200 ${
                mobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>

          <MobileNavDropdown open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </div>
      </div>
    </>
  );
};

export default Navbar;
