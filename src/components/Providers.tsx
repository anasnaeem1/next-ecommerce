"use client";

import { Suspense } from "react";
import NextTopLoader from "nextjs-toploader";
import { ClerkProvider } from "@clerk/nextjs";
import { LoadingBarProvider } from "../../context/LoadingBarContext";
import { UserContextProvider } from "../../context/UserContext";
import { CartProvider } from "../../context/CartContext";
import { CategoryProvider } from "../../context/CategoryContext";
import CartModalWrapper from "./CartModalWrapper";

const LOADER_COLOR = "#F35C7A";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <NextTopLoader
        color={LOADER_COLOR}
        height={3}
        showSpinner={false}
        shadow={`0 0 10px ${LOADER_COLOR},0 0 4px ${LOADER_COLOR}`}
        zIndex={99990}
      />
      <LoadingBarProvider>
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
      </LoadingBarProvider>
    </ClerkProvider>
  );
}

