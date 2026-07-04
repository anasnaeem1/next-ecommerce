"use client";
import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import Search from "./Search";
import NavIcons from "./NavIcons";
import NavLinks from "./NavLinks";
import Logo from "./Logo";
import { usePathname } from "next/navigation";
import { UserContext } from "../../context/UserContext";
import { motion } from "framer-motion";

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

  return (
    <>
      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-[9998] block bg-black/40 lg:hidden"
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
      )}
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
          <Link
          href="/" className="sm:hidden">Exit</Link>
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 120);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      {/* Main Navbar */}
      <motion.div
        animate={{
          opacity: scrolled ? 0 : 1,
          y: scrolled ? -20 : 0,
        }}
        transition={{ duration: 0.3 }}
        className={`sticky top-0 z-50 bg-white border-b border-gray-200 h-20 px-4 ${scrolled ? "pointer-events-none" : ""
          }`}
      >
        <div className="h-full flex items-center justify-between">
          <a href="/">
            <Logo isAdmin={false} />
          </a>

          <NavLinks />

          <div className="hidden lg:flex gap-3 items-center">
            <Search />
            <NavIcons />
          </div>
             <motion.button
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      className="lg:hidden relative w-10 h-10 flex items-center justify-center"
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle menu"
    >
      {/* Top line */}
      <motion.span
        className="absolute w-6 h-[2px] bg-black rounded-full"
        animate={
          mobileMenuOpen
            ? { rotate: 45, y: 0 }
            : { rotate: 0, y: -6 }
        }
        transition={{ duration: 0.25 }}
      />

      {/* Middle line */}
      <motion.span
        className="absolute w-6 h-[2px] bg-black rounded-full"
        animate={
          mobileMenuOpen
            ? { opacity: 0, scaleX: 0 }
            : { opacity: 1, scaleX: 1 }
        }
        transition={{ duration: 0.2 }}
      />

      {/* Bottom line */}
      <motion.span
        className="absolute w-6 h-[2px] bg-black rounded-full"
        animate={
          mobileMenuOpen
            ? { rotate: -45, y: 0 }
            : { rotate: 0, y: 6 }
        }
        transition={{ duration: 0.25 }}
      />
    </motion.button>

          <MobileNavDropdown open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </div>
      </motion.div>



      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: scrolled ? 0 : -100,
          opacity: scrolled ? 1 : 0,
        }}
        transition={{
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="lg:block hidden fixed top-5 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none"
      >
        <div
          className={`pointer-events-auto flex items-center gap-10 rounded-full
      bg-white/15 backdrop-blur-2xl border border-white/20
      shadow-[0_10px_40px_rgba(0,0,0,0.12)]
      px-8 h-14 ${scrolled ? "visible" : "invisible"
            }`}
        >
          <NavLinks />
        </div>
      </motion.div>
    </>
  );
};

export default Navbar;
