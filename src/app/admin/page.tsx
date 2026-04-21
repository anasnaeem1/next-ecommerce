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
    <div className="w-full min-h-[calc(100vh-140px)] rounded-xl border border-slate-300 bg-slate-50 p-6 md:p-8">
      <div className="border border-slate-300 rounded-lg bg-white px-5 py-6 md:px-6 md:py-7 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Urban Buy</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-semibold text-gray-900">
          Admin Control Center
        </h1>
        <p className="mt-3 max-w-2xl text-sm md:text-base text-gray-600 leading-relaxed">
          Manage your store with precision. Add products, remove outdated items, and keep your
          inventory and orders organized from one clean dashboard.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/products"
          className="border border-slate-300 rounded-lg p-5 bg-white hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors"
        >
          <p className="text-xs uppercase tracking-widest text-indigo-600 font-semibold">Create</p>
          <h2 className="mt-2 text-lg font-semibold text-gray-900">Add Product</h2>
          <p className="mt-2 text-sm text-gray-600">Launch a new listing with details, images and pricing.</p>
        </Link>

        <Link
          href="/admin/collections"
          className="border border-slate-300 rounded-lg p-5 bg-white hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors"
        >
          <p className="text-xs uppercase tracking-widest text-indigo-600 font-semibold">Manage</p>
          <h2 className="mt-2 text-lg font-semibold text-gray-900">Inventory & Collections</h2>
          <p className="mt-2 text-sm text-gray-600">Update products, review categories, and keep stock clean.</p>
        </Link>

        <Link
          href="/admin/orders"
          className="border border-slate-300 rounded-lg p-5 bg-white hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors"
        >
          <p className="text-xs uppercase tracking-widest text-indigo-600 font-semibold">Track</p>
          <h2 className="mt-2 text-lg font-semibold text-gray-900">Orders</h2>
          <p className="mt-2 text-sm text-gray-600">Monitor incoming orders and maintain fulfillment flow.</p>
        </Link>
      </div>

      <div className="mt-6 border border-slate-300 rounded-lg p-5 bg-white shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Admin Capabilities</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="px-3 py-1.5 text-xs font-semibold text-slate-700 border border-indigo-200 rounded-md bg-indigo-50/60">Add Products</span>
          <span className="px-3 py-1.5 text-xs font-semibold text-slate-700 border border-indigo-200 rounded-md bg-indigo-50/60">Delete / Remove Listings</span>
          <span className="px-3 py-1.5 text-xs font-semibold text-slate-700 border border-indigo-200 rounded-md bg-indigo-50/60">Manage Inventory</span>
          <span className="px-3 py-1.5 text-xs font-semibold text-slate-700 border border-indigo-200 rounded-md bg-indigo-50/60">Manage Orders</span>
        </div>
      </div>
    </div>
  );
}
