"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CartItem } from "@/types";
import QuantitySelector from "../QuantitySelector";
import { useCart } from "../../../context/CartContext";

interface MiniCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Customization props
  title?: string;
  width?: string;
  maxWidth?: string;
  // Custom render functions (optional)
  renderHeader?: () => React.ReactNode;
  renderItem?: (item: CartItem & { product?: any }, index: number) => React.ReactNode;
  renderFooter?: (totalPrice: number, itemCount: number) => React.ReactNode;
  // Actions (optional - will use default handlers if not provided)
  onViewCart?: () => void;
  onCheckout?: () => void;
  // Styling
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  overlayClassName?: string;
}

const MiniCartModal = ({
  isOpen,
  onClose,
  title = "MY CART",
  width = "w-[40%]",
  maxWidth = "max-w-md",
  renderHeader,
  renderItem,
  renderFooter,
  onViewCart,
  onCheckout,
  headerClassName = "",
  bodyClassName = "",
  footerClassName = "",
  overlayClassName = "",
}: MiniCartModalProps) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  
  // Always use CartProvider - component requires CartProvider in tree
  const { cart, removeItem, updateItem, loading } = useCart();
  
  const allItems = cart?.items || [];
  const itemCount = allItems.length;
  const totalPrice = cart?.totalPrice || 0;

  // Trigger animation when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShouldAnimate(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setShouldAnimate(false);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Handle remove item - uses CartProvider
  const handleRemoveItem = async (itemIndex: number) => {
    await removeItem(itemIndex);
  };

  // Handle quantity update - uses CartProvider
  const handleQuantityUpdate = async (itemIndex: number, quantity: number) => {
    await updateItem(itemIndex, { quantity });
  };

  if (!isOpen) return null;

  // Default header renderer
  const defaultRenderHeader = () => (
    <div className={`flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white ${headerClassName}`}>
      <button
        onClick={onClose}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Close cart"
      >
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">{title}</h2>
      <div className="text-sm font-medium text-gray-600">
        {loading ? "Loading..." : `${itemCount} ${itemCount === 1 ? "Item" : "Items"}`}
      </div>
    </div>
  );

  // Default item renderer
  const defaultRenderItem = (item: CartItem & { product?: any }, index: number) => {
    const productImage = item.product?.images?.[0] || "/placeholder-image.jpg";
    const productTitle = item.product?.productTitle || "Product";
    const productSlug = item.product?.slug || "";
    const itemTotal = Number(item.price) || 0;
    const itemQuantity = Number(item.quantity) || 1;
    const unitPrice = itemQuantity > 0 && itemTotal > 0 ? itemTotal / itemQuantity : (itemTotal > 0 ? itemTotal : 0);

    return (
      <div
        key={index}
        className="flex gap-4 p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
      >
        {/* Product Image */}
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

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <Link
                href={productSlug ? `/${productSlug}` : "#"}
                className="block"
              >
                <h3 className="text-sm font-semibold text-gray-900 mb-1 hover:text-gray-700 transition-colors line-clamp-2">
                  {productTitle}
                </h3>
              </Link>
              <p className="text-xs text-gray-600 mb-1">
                {item.size && `Size: ${item.size}`}
                {item.size && item.color && " • "}
                {item.color && `Color: ${item.color}`}
              </p>
              <p className="text-sm font-semibold text-gray-900">${unitPrice.toFixed(2)}</p>
            </div>
            <button
              onClick={() => handleRemoveItem(index)}
              className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-1"
              aria-label="Remove item"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <QuantitySelector
                defaultQuantity={itemQuantity}
                variant="compact"
                showLabel={false}
                onQuantityChange={(newQuantity) => {
                  handleQuantityUpdate(index, newQuantity);
                }}
              />
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                ${itemTotal.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Default footer renderer
  const defaultRenderFooter = (total: number, count: number) => (
    <div className={`border-t border-gray-200 bg-white ${footerClassName}`}>
      {/* Order Special Instructions - Collapsible */}
      <div className="px-6 py-3 border-b border-gray-200">
        <button className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
          <span>Order Special Instructions</span>
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {/* Summary of Charges */}
      <div className="px-6 py-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-700">Subtotal:</span>
          <span className="font-semibold text-gray-900">${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-700">Tax:</span>
          <span className="text-gray-600">Calculated at checkout</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-700">Shipping:</span>
          <span className="text-gray-600">FREE (surcharge may apply)</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-700">Discounts:</span>
          <span className="text-green-600">Volume Discount(-$0.00)</span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <span className="text-lg font-bold text-gray-900">Total:</span>
          <span className="text-lg font-bold text-gray-900">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6 space-y-3">
        {onCheckout ? (
          <button
            onClick={onCheckout}
            className="w-full px-4 py-3 text-sm font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded transition-colors"
          >
            Checkout
          </button>
        ) : (
          <Link
            href="/checkout"
            onClick={onClose}
            className="block w-full px-4 py-3 text-sm font-semibold text-center text-white bg-amber-700 hover:bg-amber-800 rounded transition-colors"
          >
            Checkout
          </Link>
        )}
        {onViewCart ? (
          <button
            onClick={onViewCart}
            className="w-full px-4 py-3 text-sm font-semibold text-center text-white bg-purple-600 hover:bg-purple-700 rounded transition-colors"
          >
            View Cart
          </button>
        ) : (
          <Link
            href="/cart"
            onClick={onClose}
            className="block w-full px-4 py-3 text-sm font-semibold text-center text-white bg-purple-600 hover:bg-purple-700 rounded transition-colors"
          >
            View Cart
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-[9999] transition-opacity ${
          shouldAnimate ? "opacity-100" : "opacity-0"
        } ${overlayClassName}`}
        onClick={onClose}
      />

      {/* Modal Content - Full height sidebar on right */}
      <div
        className={`fixed top-0 right-0 h-screen ${width} ${maxWidth} z-[9999] bg-white flex flex-col shadow-2xl transition-transform duration-300 ${
          shouldAnimate ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {renderHeader ? (
          renderHeader()
        ) : (
          defaultRenderHeader()
        )}

        {/* Body - All Cart Items */}
        <div className={`flex-1 overflow-y-auto ${bodyClassName}`}>
          {loading && allItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
              <p className="text-gray-500 text-base">Loading cart...</p>
            </div>
          ) : allItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <svg
                className="w-16 h-16 text-gray-300 mb-4"
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
              <p className="text-gray-500 text-base mb-2">Your cart is empty</p>
              <Link
                href="/list"
                onClick={onClose}
                className="text-sm text-blue-600 hover:text-blue-700 underline"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div>
              {allItems.map((item: CartItem & { product?: any }, index: number) =>
                renderItem ? renderItem(item, index) : defaultRenderItem(item, index)
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {allItems.length > 0 && (
          <div className="flex-shrink-0">
            {renderFooter
              ? renderFooter(totalPrice, itemCount)
              : defaultRenderFooter(totalPrice, itemCount)}
          </div>
        )}
      </div>
    </>
  );
};

export default MiniCartModal;
