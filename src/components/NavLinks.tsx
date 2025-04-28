import Link from "next/link";

const NavLinks = () => {
  const navLinks = [
    { id: "home", label: "Home", link: "/" },
    { id: "shop", label: "Shop", link: "/list" },
    { id: "about", label: "About", link: "/about" },
    { id: "contact", label: "Contact", link: "/contact" },
    { id: "admin", label: "Admin", link: "/admin" },
  ];

  return (
    <ul className="hidden gap-6 lg:flex">
      {navLinks.map((link) => (
        <li key={link.id}>
          <Link
            href={link.link}
            className="text-md font-medium text-gray-800 hover:text-pink-600 hover:underline underline-offset-4 transition-color duration-300 tracking-wider"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavLinks;
