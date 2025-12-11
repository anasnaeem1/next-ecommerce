"use client";

import { Suspense } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { UserContextProvider } from "../../context/UserContext";
import { CartProvider } from "../../context/CartContext";
import { CategoryProvider } from "../../context/CategoryContext";
import CartModalWrapper from "./CartModalWrapper";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <UserContextProvider>
        <CategoryProvider>
          <CartProvider>
            {children}
            <Suspense fallback={null}>
              <CartModalWrapper />
            </Suspense>
          </CartProvider>
        </CategoryProvider>
      </UserContextProvider>
    </ClerkProvider>
  );
}

