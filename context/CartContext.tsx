"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { CartType } from "@/types";
import { getCart, removeCartItem, updateCartItem } from "../src/serverActions/Cart/cartActions";
import { UserContext } from "./UserContext";

interface CartContextType {
  cart: CartType | null;
  setCart: (cart: CartType | null) => void;
  loading: boolean;
  refreshCart: () => Promise<void>;
  removeItem: (itemIndex: number) => Promise<void>;
  updateItem: (itemIndex: number, updates: { quantity?: number; size?: string; color?: string; variant?: string }) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
  initialCart?: CartType | null;
  userId?: string | null;
}

export function CartProvider({ children, initialCart = null, userId: serverUserId = null }: CartProviderProps) {
  const { user } = useContext(UserContext) as { user: any };
  const [cart, setCart] = useState<CartType | null>(initialCart);
  const [loading, setLoading] = useState(false);
  const initialCartRef = useRef(initialCart);
  const hasInitializedRef = useRef(false);

  // Get userId from server or user context
  const getUserId = useCallback(() => {
    return serverUserId || user?.id || null;
  }, [serverUserId, user?.id]);

  const refreshCart = useCallback(async () => {
    const currentUserId = getUserId();
    if (!currentUserId) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);
      const result = await getCart(currentUserId);
      if (result.success && result.cart) {
        const cartData = {
          ...result.cart,
          _id: result.cart._id || "",
          createdAt: result.cart.createdAt ?? undefined,
          updatedAt: result.cart.updatedAt ?? undefined,
        } as CartType;
        setCart(cartData);
      } else {
        setCart(null);
      }
    } catch (error) {
      console.error("Error refreshing cart:", error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [getUserId]);

  const removeItem = useCallback(async (itemIndex: number) => {
    const currentUserId = getUserId();
    if (!currentUserId) {
      console.error("Cannot remove item: No user ID");
      return;
    }

    if (!cart || !cart.items || itemIndex < 0 || itemIndex >= cart.items.length) {
      console.error("Invalid item index:", itemIndex);
      return;
    }

    try {
      setLoading(true);
      const result = await removeCartItem(currentUserId, itemIndex);
      if (result.success && result.cart) {
        const cartData = {
          ...result.cart,
          _id: result.cart._id || "",
          createdAt: result.cart.createdAt ?? undefined,
          updatedAt: result.cart.updatedAt ?? undefined,
        } as CartType;
        setCart(cartData);
        console.log("✅ Item removed from cart");
      } else {
        console.error("Failed to remove item:", result.message);
      }
    } catch (error) {
      console.error("Error removing cart item:", error);
    } finally {
      setLoading(false);
    }
  }, [getUserId, cart]);

  const updateItem = useCallback(async (itemIndex: number, updates: { quantity?: number; size?: string; color?: string; variant?: string }) => {
    const currentUserId = getUserId();
    if (!currentUserId) {
      console.error("Cannot update item: No user ID");
      return;
    }

    if (!cart || !cart.items || itemIndex < 0 || itemIndex >= cart.items.length) {
      console.error("Invalid item index:", itemIndex);
      return;
    }

    if (!updates || Object.keys(updates).length === 0) {
      console.error("No updates provided");
      return;
    }

    try {
      setLoading(true);
      const result = await updateCartItem(currentUserId, itemIndex, updates);
      if (result.success && result.cart) {
        const cartData = {
          ...result.cart,
          _id: result.cart._id || "",
          createdAt: result.cart.createdAt ?? undefined,
          updatedAt: result.cart.updatedAt ?? undefined,
        } as CartType;
        setCart(cartData);
        console.log("✅ Item updated in cart");
      } else {
        console.error("Failed to update item:", result.message);
      }
    } catch (error) {
      console.error("Error updating cart item:", error);
    } finally {
      setLoading(false);
    }
  }, [getUserId, cart]);

  useEffect(() => {
    // Initialize with initialCart if provided (only once)
    if (!hasInitializedRef.current && initialCartRef.current && initialCartRef.current._id) {
      setCart(initialCartRef.current);
      hasInitializedRef.current = true;
      return;
    }

    // If no initial cart, fetch when we have userId
    if (!hasInitializedRef.current) {
      const currentUserId = getUserId();
      if (currentUserId) {
        refreshCart();
        hasInitializedRef.current = true;
      }
    }
  }, [getUserId, refreshCart]);

  // Watch for user changes and refresh cart (after initial load)
  useEffect(() => {
    if (hasInitializedRef.current && user?.id && !initialCartRef.current?._id) {
      refreshCart();
    }
  }, [user?.id, refreshCart]);

  return (
    <CartContext.Provider value={{ cart, setCart, loading, refreshCart, removeItem, updateItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

