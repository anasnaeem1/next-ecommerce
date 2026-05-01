"use client";
import { createContext, useCallback, useContext, useState, ReactNode } from "react";
import { ProductType } from "@/types";
import { getProducts, deleteProduct as removeProductOnServer } from "@/serverActions/Product/productActions";

interface CollectionContextType {
  products: ProductType[];
  category: string | null;
  loading: boolean;
  error: string | null;
  refreshProducts: (nextCategory?: string | null) => Promise<void>;
  setCategory: (value: string | null) => void;
  deleteProduct: (uniqueId: string) => Promise<{ success: boolean; message?: string }>;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

interface CollectionProviderProps {
  children: ReactNode;
  initialProducts?: ProductType[];
  initialCategory?: string | null;
}

export function CollectionProvider({
  children,
  initialProducts = [],
  initialCategory = null,
}: CollectionProviderProps) {
  const [products, setProducts] = useState<ProductType[]>(initialProducts);
  const [category, setCategoryState] = useState<string | null>(initialCategory);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setCategory = useCallback((value: string | null) => {
    setCategoryState(value);
  }, []);

  const refreshProducts = useCallback(
    async (nextCategory?: string | null) => {
      const categoryToUse = nextCategory ?? category;

      try {
        setLoading(true);
        setError(null);
        const result = await getProducts((categoryToUse || null) as any);

        if (result.success) {
          setProducts(Array.isArray(result.products) ? result.products : []);
        } else {
          setProducts([]);
          setError(result.message || "Failed to load products");
        }
      } catch (err: any) {
        setProducts([]);
        setError(err?.message || "An error occurred while loading products");
      } finally {
        setLoading(false);
      }
    },
    [category]
  );

  const deleteProduct = useCallback(async (uniqueId: string) => {
    setError(null);
    const result = await removeProductOnServer(uniqueId);
    if (result?.success) {
      setProducts((prev) => prev.filter((p) => p.uniqueId !== uniqueId));
    } else {
      setError(result?.message || "Failed to delete product");
    }
    return result;
  }, []);

  return (
    <CollectionContext.Provider
      value={{
        products,
        category,
        loading,
        error,
        refreshProducts,
        setCategory,
        deleteProduct,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollection() {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error("useCollection must be used within a CollectionProvider");
  }
  return context;
}
