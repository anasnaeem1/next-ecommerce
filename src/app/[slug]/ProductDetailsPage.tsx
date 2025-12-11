"use client";
import { useContext, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import ProductImages from "../../components/ProductImages";
import CustomizeSection from "../../components/CustomizeSection";
import QuantitySelector from "../../components/QuantitySelector";
import Reviews from "../../components/Reviews";
import AddToCart from "@/components/AddToCart";
import { UserType } from "@/types";
import { UserContext } from "../../../context/UserContext";
import { useProduct } from "../../../context/ProductContext";
import { useCart } from "../../../context/CartContext";
import { addToCartAction } from "./actions";

const ProductDetailsPage = () => {
  const { user } = useContext(UserContext) as { user: UserType };
  const { refreshCart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  
  const {
    product: productDetails,
    productImages,
    productVariants,
    productId,
    slug,
    loading,
    error
  } = useProduct();
  
  const [hasSelectedColor, setHasSelectedColor] = useState(false);
  const [hasSelectedSize, setHasSelectedSize] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Loading state
  if (loading && !productDetails) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-gray-500">Loading product...</div>
      </div>
    );
  }

  // Error state
  if (error || !productDetails) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Product not found</h1>
          <p className="text-gray-600">{error || "The product you're looking for doesn't exist."}</p>
        </div>
      </div>
    );
  }

  const disableCustomizeSection = productVariants.length === 1 && productVariants[0].color === "Default";

  // Check if both color and size are selected (or if customization is disabled)
  const canAddToCart = disableCustomizeSection || (hasSelectedColor && hasSelectedSize);

  // Handle selection changes from CustomizeSection
  const handleSelectionChange = (hasColor: boolean, hasSize: boolean) => {
    setHasSelectedColor(hasColor);
    setHasSelectedSize(hasSize);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAddingToCart(true);
    
    const formData = new FormData(e.currentTarget);
    
    if (!disableCustomizeSection) {
      const size = formData.get("size");
      const color = formData.get("color");
      
      if (!size || !color) {
        alert("Please select both color and size before adding to cart");
        setIsAddingToCart(false);
        return;
      }
    }
    
    try {
      const result = await addToCartAction(formData);
      
      if (result?.success) {
        await refreshCart();
        router.push(`${pathname}?viewCart=true`, { scroll: false });
      } else {
        console.error("Failed to add to cart:", result?.message);
        alert(result?.message || "Failed to add item to cart. Please try again.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("An error occurred while adding to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <>
    <form onSubmit={handleFormSubmit} className="w-full bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <input type="hidden" name="productId" value={productId || ""} />

      {user && (
        <input type="hidden" name="userId" value={user?.id || "a"} />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
          
          {/* Image Gallery */}
          <div className="lg:sticky lg:top-24 h-fit">
            <ProductImages productImages={productImages} />
          </div>

          <div className="flex flex-col space-y-8">
            {/* Title & Description */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight tracking-tight">
                {productDetails?.productTitle}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                {productDetails?.productDesc}
              </p>
            </div>

            {/* Price Section */}
            <div className="flex items-baseline gap-4 pb-6 border-b border-gray-200">
              <div className="flex items-baseline gap-3">
                {productDetails?.offerPrice && productDetails?.offerPrice < productDetails?.basePrice && (
                  <span className="text-xl text-gray-400 line-through">
                    ${productDetails?.basePrice}
                  </span>
                )}
                <span className="text-4xl font-light text-gray-900">
                  ${productDetails?.offerPrice ?? productDetails?.basePrice}
                </span>
              </div>
              {productDetails?.offerPrice && productDetails?.offerPrice < productDetails?.basePrice && (
                <span className="px-3 py-1 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-full">
                  Save ${((productDetails?.basePrice || 0) - (productDetails?.offerPrice || 0)).toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                productDetails?.totalStock > 0
                  ? "text-emerald-700 bg-emerald-50"
                  : "text-red-700 bg-red-50"
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  productDetails?.totalStock > 0 ? "bg-emerald-500" : "bg-red-500"
                }`}></div>
                {productDetails?.totalStock > 0
                  ? `${productDetails?.totalStock} in stock`
                  : "Out of stock"}
              </div>
            </div>

            {/* Customization Section */}
            {!disableCustomizeSection && (
              <div className="pt-4">
                <CustomizeSection 
                  variants={productVariants} 
                  onSelectionChange={handleSelectionChange}
                />
              </div>
            )}

            {/* Add to Cart Section */}
            <div className="pt-6">
              <QuantitySelector />
            </div>
            <div className="space-y-2">
              <AddToCart disabled={!canAddToCart || isAddingToCart} />
              {isAddingToCart && (
                <p className="text-sm text-blue-600 flex items-center gap-1">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding to cart...
                </p>
              )}
              {!canAddToCart && !disableCustomizeSection && !isAddingToCart && (
                <p className="text-sm text-amber-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Please select both color and size to add to cart
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-gray-200 pt-12">
          {productId && slug && <Reviews productId={productId} productSlug={slug}/>}
        </div>
      </div>

    </form>
    </>
  );
};

export default ProductDetailsPage;

