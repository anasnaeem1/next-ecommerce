"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { UserContext } from "../../../context/UserContext";

export default function AdminHomePage() {
  const { user: currentUser, userLoaded } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (userLoaded && !currentUser) {
      router.push(`/`);
    }
  }, [userLoaded, currentUser]);

  return (
 <div className="w-full min-h-[calc(100vh-140px)] bg-gradient-to-b from-[#faf9f7] via-white to-[#f6f5f3]">

  {/* HERO */}
  <div>
    <div className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.05)] px-5 sm:px-8 py-8">

      <p className="text-[10px] tracking-[0.35em] uppercase text-neutral-400">
        Urban Buy Admin
      </p>

      <h1 className="mt-2 text-3xl sm:text-4xl font-light text-neutral-900 leading-tight">
        Control your store
        <span className="block font-medium">with clarity</span>
      </h1>

      <p className="mt-4 max-w-xl text-sm text-neutral-500 leading-6">
        Manage products, orders, and inventory from a clean, fast and minimal dashboard.
      </p>

      {/* CTA */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/admin/products"
          className="px-5 py-2.5 rounded-full bg-black text-white text-xs sm:text-sm hover:scale-[1.02] transition"
        >
          + Add Product
        </Link>

        <Link
          href="/admin/orders"
          className="px-5 py-2.5 rounded-full bg-white/60 border border-neutral-200 text-xs sm:text-sm text-neutral-700 hover:bg-white transition"
        >
          Orders
        </Link>

        <Link
          href="/admin/collections"
          className="px-5 py-2.5 rounded-full bg-white/60 border border-neutral-200 text-xs sm:text-sm text-neutral-700 hover:bg-white transition"
        >
          Inventory
        </Link>
      </div>
    </div>
  </div>

  {/* GRID */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">

    {[
      { title: "Products", desc: "Manage listings", link: "/admin/products" },
      { title: "Inventory", desc: "Track stock", link: "/admin/collections" },
      { title: "Orders", desc: "Handle purchases", link: "/admin/orders" },
    ].map((item) => (
      <Link
        key={item.title}
        href={item.link}
        className="group relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] px-5 py-5 hover:shadow-[0_18px_50px_rgba(0,0,0,0.08)] transition"
      >
        <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-neutral-200 blur-3xl opacity-40 group-hover:opacity-60 transition" />

        <h2 className="text-base font-medium text-neutral-900">
          {item.title}
        </h2>

        <p className="mt-1 text-xs text-neutral-500">
          {item.desc}
        </p>

        <div className="mt-4 text-xs text-neutral-700 flex items-center gap-1 group-hover:gap-2 transition-all">
          Open <span>→</span>
        </div>
      </Link>
    ))}
  </div>

  {/* CAPABILITIES */}
  <div className="mt-6">
    <div className="rounded-2xl bg-white/60 backdrop-blur-xl px-5 py-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">

      <h3 className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
        Capabilities
      </h3>

      <div className="mt-3 flex flex-wrap gap-2">
        {[
          "Add Products",
          "Remove Listings",
          "Inventory",
          "Orders",
        ].map((cap) => (
          <span
            key={cap}
            className="px-3 py-1.5 text-[11px] rounded-full bg-white border border-neutral-200 text-neutral-600"
          >
            {cap}
          </span>
        ))}
      </div>

    </div>
  </div>

</div>
  );
}
