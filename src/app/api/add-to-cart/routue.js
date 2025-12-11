import { NextResponse } from "next/server";
// import { v2 as cloudinary } from "cloudinary";
// import { Readable } from "stream";
import Cart from "../../../../models/Cart.js";


export const POST = async (req) => {
    try {
      const formData = await req.formData();
      return NextResponse.json(
        { message: "we have recieved product you can continue", product: formData },
        { status: 200 }
      );

    } catch (error) {
      console.error("❌ Server error:", error);
      return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
  };