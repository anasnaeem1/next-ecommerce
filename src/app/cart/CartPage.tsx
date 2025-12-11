"use client";

import Image from "next/image";
import Link from "next/link";
import QuantitySelector from "../../components/QuantitySelector";
import { useCart } from "../../../context/CartContext";
import { CartItem } from "@/types";

const CartPage = () => {
  const { cart, loading, removeItem, updateItem } = useCart();

  if (loading && !cart) {
    return (
      <div className="min-h-[calc(100vh-80px)] w-full bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-gray-500">Loading cart...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-80px)] w-full bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <svg
              className="w-24 h-24 text-gray-300 mx-auto mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h1 className="text-3xl font-light text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
            <Link
              href="/list"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-300 group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 1024 1024"
                className="fill-current transition-transform duration-300 group-hover:-translate-x-1"
              >
                <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z" />
              </svg>
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const itemCount = cart.items.length;

  return (
    <div className="min-h-[calc(100vh-80px)] w-full bg-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">CART</h1>
          <p className="text-sm text-gray-600">*Automatic discounts visible in checkout*</p>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 pb-4 border-b-2 border-gray-900 mb-6">
          <div className="col-span-6">
            <span className="text-sm font-semibold text-gray-900 uppercase tracking-wide">PRODUCT</span>
          </div>
          <div className="col-span-3 text-center">
            <span className="text-sm font-semibold text-gray-900 uppercase tracking-wide">QUANTITY</span>
          </div>
          <div className="col-span-3 text-right">
            <span className="text-sm font-semibold text-gray-900 uppercase tracking-wide">TOTAL</span>
          </div>
        </div>

        {/* Cart Items */}
        <div className="space-y-8 mb-8">
          {cart.items.map((item: CartItem & { product?: any }, index: number) => {
            const productImage = item.product?.images?.[0] || "/placeholder-image.jpg";
            const productTitle = item.product?.productTitle || "Product";
            const productSlug = item.product?.slug || "";
            // Ensure price is a valid number - item.price is the total (price * quantity)
            const itemTotal = Number(item.price) || 0;
            const itemQuantity = Number(item.quantity) || 1;
            const unitPrice = itemQuantity > 0 && itemTotal > 0 ? itemTotal / itemQuantity : (itemTotal > 0 ? itemTotal : 0);
            
            // Debug logging
            if (itemTotal === 0) {
              console.warn("⚠️ Item has zero price:", { item, productTitle });
            }

            return (
              <div key={index} className="grid grid-cols-12 gap-4 items-start">
                {/* PRODUCT Column */}
                <div className="col-span-6 flex gap-4">
                  <Link
                    href={productSlug ? `/${productSlug}` : "#"}
                    className="flex-shrink-0 w-24 h-24 rounded overflow-hidden bg-gray-100"
                  >
                    <Image
                      src={productImage}
                      alt={productTitle}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={productSlug ? `/${productSlug}` : "#"}
                      className="block"
                    >
                      <h3 className="text-base font-semibold text-gray-900 mb-1 hover:text-gray-700 transition-colors">
                        {productTitle.toUpperCase()}
                      </h3>
                    </Link>
                    <p className="text-sm font-semibold text-gray-900 mb-2">
                      ${unitPrice > 0 ? unitPrice.toFixed(2) : "0.00"}
                    </p>
                    <div className="text-xs text-gray-600">
                      <span>Size: {item.size}</span>
                      <span className="mx-2">•</span>
                      <span>Color: {item.color}</span>
                    </div>
                  </div>
                </div>

                {/* QUANTITY Column */}
                <div className="col-span-3">
                  <div className="flex flex-col items-center gap-3">
                    <QuantitySelector
                      defaultQuantity={item.quantity}
                      variant="compact"
                      showLabel={false}
                      onQuantityChange={(newQuantity) => {
                        updateItem(index, { quantity: newQuantity });
                      }}
                    />
                    <button
                      onClick={() => removeItem(index)}
                      className="text-xs text-gray-600 hover:text-red-600 transition-colors underline"
                      aria-label="Remove item"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* TOTAL Column */}
                <div className="col-span-3 text-right">
                  <p className="text-base font-semibold text-gray-900">
                    ${itemTotal > 0 ? itemTotal.toFixed(2) : "0.00"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="border-t-2 border-gray-200 pt-6 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-gray-900">Total:</span>
            <span className="text-lg font-semibold text-gray-900">
              ${(Number(cart.totalPrice) || 0).toFixed(2)} USD
            </span>
          </div>
          <p className="text-sm text-gray-500 text-right">
            Taxes and shipping calculated at checkout
          </p>
        </div>
      </div>

      {/* Checkout Button - Fixed Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link
          href="/checkout"
          className="group relative inline-flex items-center justify-center gap-2 px-8 py-3 bg-gray-900 text-white font-semibold rounded-none overflow-hidden transition-all duration-300 hover:bg-gray-800"
        >
          <span className="relative z-10">CHECKOUT</span>
          
          {/* Hover effect background */}
          <div className="absolute inset-0 bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
      </div>
    </div>
  );
};

export default CartPage;

