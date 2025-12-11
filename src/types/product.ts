/**
 * Product Types
 */

export type SizeType = {
  size: string;
  stock: number;
  sku?: string;
  price?: number;
  isDefault?: boolean;
  _id?: string;
};

export type VariantType = {
  color: string;
  colorCode?: string;
  isDefault?: boolean;
  sizes: SizeType[];
  _id?: string;
};

export type ProductType = {
  _id: string;
  uniqueId: string;
  productTitle: string;
  productDesc: string;
  images: string[];
  category: string;
  price: number;
  basePrice: number;
  offerPrice?: number;
  totalStock: number;
  variants: VariantType[];
  createdAt?: Date;
  updatedAt?: Date;
};

