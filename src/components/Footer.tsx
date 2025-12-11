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
    <div
      className={`${
        !showFooter ? "hidden" : "block"
      } py-24 px-4 md:px-8 lg:px-16 xl:32 2xl:px-64 bg-gray-100 text-sm`}
    >
      <div>
        {/* TOP */}
        <div className="flex flex-col md:flex-row justify-between gap-24">
          {/* LEfT  */}
          <div className="w-full md:w-1/2 lg:w-1/4 flex flex-col gap-8">
            <Link href="/">
              <h1 className="uppercase text-2xl tracking-wide">urban</h1>
            </Link>
            <p className="">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat
              cumque
            </p>

            <div className="flex gap-6">
              <Image src="/instagram.png" alt="" width={16} height={16} />
              <Image src="/youtube.png" alt="" width={16} height={16} />
              <Image src="/pinterest.png" alt="" width={16} height={16} />
              <Image src="/x.png" alt="" width={16} height={16} />
            </div>
            <span className="font-semibold">heyanas42@gmail.com</span>
            <span className="font-semibold">+1 234 567 890</span>
            <ul className="flex justify-center items-center gap-4">
              <ul className="flex gap-4 justify-center items-center">
                {socials.map((social, index) => (
                  <li key={index} className="relative group">
                    <a
                      href="#"
                      data-social={social.name.toLowerCase()}
                      className="relative flex justify-center items-center w-[40px] h-[40px] rounded-full text-[#4d4d4d] bg-white overflow-hidden transition duration-300 ease-in-out hover:text-white"
                    >
                      <span
                        className="absolute bottom-0 left-0 w-full h-0 group-hover:h-full transition-all duration-300 ease-in-out"
                        style={{ background: social.bg }}
                      ></span>
                      <Image
                        src={social.icon}
                        alt={social.name}
                        width={24}
                        height={24}
                        className={`relative z-10 transition duration-300 ${
                          social.name !== "YouTube"
                            ? "group-hover:invert group-hover:brightness-0 group-hover:contrast-100"
                            : ""
                        }`}
                      />
                    </a>
                    <span
                      className="absolute top-[-30px] left-1/2 -translate-x-1/2 text-white text-sm px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:top-[-30px] transition-all duration-300"
                      style={{ background: social.bg }}
                    >
                      {social.name}
                    </span>
                  </li>
                ))}
              </ul>
            </ul>
          </div>
          {/* CENTER */}
          <div className="hidden lg:flex justify-between w-1/2">
            <div className="flex flex-col justify-between">
              <h1 className="font-semibold text-lg">COMPANY</h1>
              <div className="flex flex-col gap-6">
                <Link href="">About Us</Link>
                <Link href="">Careers</Link>
                <Link href="">Affiliates</Link>
                <Link href="">Blog</Link>
                <Link href="">Contact Us</Link>
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <h1 className="font-semibold text-lg">SHOP</h1>
              <div className="flex flex-col gap-6">
                <Link href="">New Arrivals</Link>
                <Link href="">Accessories</Link>
                <Link href="">Men</Link>
                <Link href="">Women</Link>
                <Link href="">All Products</Link>
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <h1 className="font-semibold text-lg">HELP</h1>
              <div className="flex flex-col gap-6">
                <Link href="">Customer Service</Link>
                <Link href="">My Account</Link>
                <Link href="">Find a Store</Link>
                <Link href="">Legal & Privacy</Link>
                <Link href="">Gift Card</Link>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-8">
            <h1 className="font-semibold text-lg uppercase">Subscribe</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Distinctio fugiat hic
            </p>
            <div className="flex items-center">
              <input
                type="email"
                id="Email"
                name="Email"
                placeholder="uiverse@verse.io"
                autoComplete="off"
                className="min-h-[50px] max-w-[150px] px-4 text-black text-sm border border-[#5e4dcd] rounded-l-md bg-transparent focus:outline-none focus:border-[#3898EC]"
              />
              <input
                type="submit"
                value="Join"
                className="min-h-[50px] px-4 bg-[#5e4dcd] text-white text-sm rounded-r-md cursor-pointer transition-colors duration-300 hover:bg-[#5e5dcd] border-none"
              />
            </div>
            <span className="font-semibold">Secure Payments</span>
            <div className="flex justify-between">
              <Image src="/discover.png" alt="" width={40} height={20} />
              <Image src="/skrill.png" alt="" width={40} height={20} />
              <Image src="/paypal.png" alt="" width={40} height={20} />
              <Image src="/mastercard.png" alt="" width={40} height={20} />
              <Image src="/visa.png" alt="" width={40} height={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
