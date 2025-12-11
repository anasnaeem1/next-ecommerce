import { NextResponse } from "next/server";
import { getSingleProduct } from "../../../serverActions/product";

export const POST = async (req) => {
  try {
    const { slug } = await req.json(); // 👈 getting slug from body

    const result = await getSingleProduct(slug);

    if (result.success) {
      return NextResponse.json({
        message: "here is the product",
        data: result.product,
      });
    } else {
      return NextResponse.json({ message: result.message }, { status: 500 });
    }
  } catch (err) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
};
