"use client";

import { useMemo, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCollection } from "@/context/CollectionContext";
import AdminListTable from "@/components/admin/AdminListTable";

type CategoryOption = {
  key: string;
  label: string;
};

type CollectionsContentProps = {
  categories: CategoryOption[];
};

const CollectionsContent = ({ categories }: CollectionsContentProps) => {
  const { products, category, setCategory, loading, error, refreshProducts } = useCollection();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const selectedCategory = category || "";

  const categoryOptions = useMemo(
    () => [{ key: "", label: "All categories" }, ...categories],
    [categories]
  );

  const handleCategoryChange = (value: string) => {
    const normalizedCategory = value || null;
    setCategory(normalizedCategory);

    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }

    startTransition(async () => {
      await refreshProducts(normalizedCategory);
      router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
    });
  };

  const emptyStateText =
    loading || isPending
      ? "Loading products..."
      : error
      ? error
      : "No products found.";

  return (
    <AdminListTable
      title="Collections"
      columns={[
        { key: "product", label: "Product" },
        { key: "category", label: "Category" },
        { key: "price", label: "Price" },
        { key: "action", label: "Action" },
        { key: "edit", label: "Edit" },
      ]}
      rows={!loading && !isPending && !error ? products : []}
      searchPlaceholder="Search by product name"
      searchBy={(product) => `${product.productTitle} ${product.uniqueId}`}
      emptyText={emptyStateText}
      rightControls={
        <select
          className="h-10 w-full sm:w-56 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:border-indigo-300"
          value={selectedCategory}
          onChange={(event) => handleCategoryChange(event.target.value)}
        >
          {categoryOptions.map((item) => (
            <option key={item.key || "all"} value={item.key}>
              {item.label}
            </option>
          ))}
        </select>
      }
      renderRow={(product) => (
        <tr key={product._id} className="border-b border-slate-200 hover:bg-indigo-50/30 transition-colors">
          <td className="px-5 py-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative w-16 h-16 bg-slate-100 rounded-md overflow-hidden shrink-0 border border-slate-200">
                {product.images?.[0] && (
                  <Image
                    src={product.images[0]}
                    alt={product.productTitle}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{product.productTitle}</p>
                <p className="text-xs text-slate-500 truncate">{product.uniqueId}</p>
              </div>
            </div>
          </td>
          <td className="px-5 py-4 text-sm text-slate-700">{product.category || "-"}</td>
          <td className="px-5 py-4 text-sm font-medium text-slate-900">
            ${product.offerPrice ?? product.basePrice}
          </td>
          <td className="px-5 py-4">
            <Link
              href={`/${product.uniqueId}`}
              className="inline-flex items-center rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
            >
              View
            </Link>
          </td>
          <td className="px-5 py-4">
            <Link
              href={`/admin/inventory/${product.uniqueId}`}
              className="inline-flex items-center rounded-md border border-indigo-200 px-3 py-2 text-sm text-indigo-700 hover:bg-indigo-50 transition-colors"
            >
              Edit
            </Link>
          </td>
        </tr>
      )}
    />
  );
};

export default CollectionsContent;
