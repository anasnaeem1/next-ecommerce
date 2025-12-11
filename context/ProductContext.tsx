"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { ProductType, VariantType } from "@/types";
import { getProductDetails } from "../src/serverActions/Product./productActions";

interface ProductContextType {
  product: ProductType | null;
  productImages: string[];
  productVariants: VariantType[];
  productId: string | null;
  slug: string | null;
  loading: boolean;
  error: string | null;
  refreshProduct: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: ReactNode;
  initialProduct?: ProductType | null;
  initialImages?: string[];
  initialVariants?: VariantType[];
  initialProductId?: string | null;
  initialSlug?: string | null;
}

export function ProductProvider({
  children,
  initialProduct = null,
  initialImages = [],
  initialVariants = [],
  initialProductId = null,
  initialSlug = null,
}: ProductProviderProps) {
  const [product, setProduct] = useState<ProductType | null>(initialProduct);
  const [productImages, setProductImages] = useState<string[]>(initialImages);
  const [productVariants, setProductVariants] = useState<VariantType[]>(initialVariants);
  const [productId, setProductId] = useState<string | null>(initialProductId);
  const [slug, setSlug] = useState<string | null>(initialSlug);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialProductRef = useRef(initialProduct);
  const hasInitializedRef = useRef(false);

  // Refresh product data
  const refreshProduct = useCallback(async () => {
    const currentSlug = slug;
    if (!currentSlug) {
      setError("No product slug provided");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await getProductDetails(currentSlug);

      if (result.success && result.product) {
        const productData = result.product;
        setProduct(productData);
        setProductImages(Array.isArray(result.images) ? result.images : productData.images || []);
        setProductVariants(Array.isArray(result.variants) ? result.variants : productData.variants || []);
        setProductId(productData._id);
        setError(null);
      } else {
        setError(result.message || "Failed to load product");
        setProduct(null);
      }
    } catch (err: any) {
      console.error("Error refreshing product:", err);
      setError(err.message || "An error occurred while loading the product");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  // Initialize with initial product if provided
  useEffect(() => {
    if (!hasInitializedRef.current && initialProductRef.current) {
      setProduct(initialProductRef.current);
      setProductImages(initialImages);
      setProductVariants(initialVariants);
      setProductId(initialProductId);
      setSlug(initialSlug);
      hasInitializedRef.current = true;
    }
  }, [initialProduct, initialImages, initialVariants, initialProductId, initialSlug]);

  // Update slug when it changes (e.g., navigation to different product)
  useEffect(() => {
    if (slug && slug !== initialSlug) {
      refreshProduct();
    }
  }, [slug, initialSlug, refreshProduct]);

  return (
    <ProductContext.Provider
      value={{
        product,
        productImages,
        productVariants,
        productId: productId || product?._id || null,
        slug: slug || product?.uniqueId || null,
        loading,
        error,
        refreshProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
}

