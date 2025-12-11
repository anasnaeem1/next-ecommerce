import { NextResponse } from "next/server";
import {addDummyProduct} from "../../../serverActions/product"

export const POST = async () => {
  const result = await addDummyProduct();
  if (result.success) {
    return NextResponse.json({
      message: "Dummy product added",
      product: result.product,
    });
  } else {
    return NextResponse.json(
      { message: result.message },
      { status: 500 }
    );
  }
};