import { NextResponse } from "next/server";
import { connectDb } from "../../../../config/db.js";
import Product from "../../../../models/Product.js";

export const GET = async (req) => {
  try {
    await connectDb();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ message: "Slug is required" }, { status: 400 });
    }

    const productDetails = await Product.findOne({ uniqueId: slug }).lean();

    if (!productDetails) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Here is the product",
        data: productDetails,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
};
