/**
 * Cart Types
 */

export type CartItem = {
  productId: string;
  quantity: number;
  price: number;
  variant?: string;
  size: string;
  color: string;
};

export type CartType = {
  _id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

