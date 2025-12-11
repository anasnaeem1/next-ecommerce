"use server";

import { createOrder } from "../../serverActions/Order/orderActions";

export async function createOrderAction(formData: FormData) {
  return await createOrder(formData);
}

