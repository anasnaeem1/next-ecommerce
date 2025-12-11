import { auth } from "@clerk/nextjs/server";
import { CartProvider } from "../../../context/CartContext";
import { getCart } from "../../serverActions/Cart/cartActions";
import { CartType } from "@/types";

// Force dynamic rendering since we use auth() which uses headers()
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let initialCart: CartType | null = null;
  let userId: string | null = null;

  try {
    const { userId: authUserId } = await auth();
    userId = authUserId;

    if (userId) {
      const result = await getCart(userId);
      if (result.success && result.cart) {
        initialCart = {
          ...result.cart,
          _id: result.cart._id || "",
          createdAt: result.cart.createdAt ?? undefined,
          updatedAt: result.cart.updatedAt ?? undefined,
        } as CartType;
      }
    }
  } catch (error: any) {
    // Silently handle dynamic server usage errors during build
    // This is expected when using auth() in layouts
    if (error?.digest !== 'DYNAMIC_SERVER_USAGE') {
      console.error("Error fetching cart in layout:", error);
    }
  }

  return (
    <CartProvider initialCart={initialCart} userId={userId}>
      {children}
    </CartProvider>
  );
}

