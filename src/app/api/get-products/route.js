import { getSingleProduct } from "../../../serverActions/product";
import Product from "../../../../models/Product.js";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { message: "Slug is required" },
        { status: 400 }
      );
    }

    const productDetails = await Product.findOne({ uniqueId: slug });

    if (result.success) {
      return NextResponse.json(
        {
          message: "Here is the product",
          data: productDetails,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: result.message || "Failed to fetch product" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
};

