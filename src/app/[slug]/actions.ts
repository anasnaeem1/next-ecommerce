"use server";

import { addToCart } from "../../serverActions/Cart/cartActions";

export async function addToCartAction(formData: FormData) {
  return await addToCart(formData);
}

