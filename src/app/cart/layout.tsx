import { auth } from "@clerk/nextjs/server";
import { CartProvider } from "../../../context/CartContext";
import { getCart } from "../../serverActions/Cart/cartActions";
import { CartType } from "@/types";

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
  } catch (error) {
    console.error("Error fetching cart in layout:", error);
  }

  return (
    <CartProvider initialCart={initialCart} userId={userId}>
      {children}
    </CartProvider>
  );
}

