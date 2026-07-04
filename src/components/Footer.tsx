"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  const hideFooterRoutes = ["/login", "/register"];

  const isAdminPage = pathname.startsWith("/admin");
  const isCheckoutPage = pathname.startsWith("/checkout");
  const showFooter = !hideFooterRoutes.includes(pathname) && !isAdminPage && !isCheckoutPage;
  const socials = [
    {
      name: "Instagram",
      icon: "/instagram.png",
      bg: "linear-gradient(45deg, #405de6, #5b51db, #b33ab4, #c135b4, #e1306c, #fd1f1f)",
    },
    // {
    //   name: "YouTube",
    //   icon: "/youtube.png",
    //   bg: "#FF0000",
    // },
    {
      name: "Pinterest",
      icon: "/pinterest.png",
      bg: "#E60023",
    },
    {
      name: "X",
      icon: "/x.png",
      bg: "#000000",
    },
    {
      name: "Facebook",
      icon: "/facebook.png",
      bg: "#1877f2",
    },
  ];

  return (
    <footer
      className={`${!showFooter ? "hidden" : "block"
        } border-t border-neutral-200 bg-[#111111] text-neutral-300`}
    >
      <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">

        {/* Main */}
        <div className="flex flex-col lg:flex-row justify-between gap-14 py-16">

          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/">
              <h2 className="text-3xl font-light tracking-[0.35em] text-white">
                URBAN
              </h2>
            </Link>

            <p className="mt-5 leading-7 text-neutral-400">
              Premium essentials designed with timeless aesthetics,
              exceptional craftsmanship and effortless everyday elegance.
            </p>

            <div className="mt-8 flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
                >
                  <Image
                    src={social.icon}
                    alt={social.name}
                    width={18}
                    height={18}
                    className="brightness-0 invert opacity-90 transition duration-300 group-hover:opacity-100"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-20">

            <div>
              <p className="mb-6 text-xs uppercase tracking-[0.35em] text-neutral-500">
                Shop
              </p>

              <div className="space-y-4">
                <Link href="/list" className="block hover:text-white transition">
                  New Arrivals
                </Link>

                <Link href="/list" className="block hover:text-white transition">
                  Men
                </Link>

                <Link href="/list" className="block hover:text-white transition">
                  Women
                </Link>

                <Link href="/list" className="block hover:text-white transition">
                  Accessories
                </Link>
              </div>
            </div>

            <div>
              <p className="mb-6 text-xs uppercase tracking-[0.35em] text-neutral-500">
                Company
              </p>

              <div className="space-y-4">
                <Link href="/about" className="block hover:text-white transition">
                  About
                </Link>

                <Link href="/contact" className="block hover:text-white transition">
                  Contact
                </Link>

                <Link href="/" className="block hover:text-white transition">
                  Privacy
                </Link>

                <Link href="/" className="block hover:text-white transition">
                  Terms
                </Link>
              </div>
            </div>

          </div>

          {/* Newsletter */}
          <div className="max-w-sm">
            <p className="mb-6 text-xs uppercase tracking-[0.35em] text-neutral-500">
              Newsletter
            </p>

            <p className="mb-6 leading-7 text-neutral-400">
              Join to receive exclusive drops and seasonal collections.
            </p>

            <div className="flex overflow-hidden rounded-full border border-white/10 bg-white/5">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-transparent px-6 py-4 text-white placeholder:text-neutral-500 outline-none"
              />

              <button className="bg-white px-8 font-medium text-black transition hover:bg-neutral-200">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}

        <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 py-8 text-sm text-neutral-500">

          <p>© 2026 URBAN. Crafted with precision.</p>

          <div className="mt-4 flex items-center gap-6 md:mt-0">

            <Image src="/visa.png" alt="" width={42} height={24} />

            <Image src="/mastercard.png" alt="" width={42} height={24} />

            <Image src="/paypal.png" alt="" width={42} height={24} />

          </div>

        </div>

      </div>
    </footer>
  );
};
export default Footer;
