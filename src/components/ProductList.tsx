"use client";
import { ProductType } from "@/types";
import Link from "next/link";
import Image from "next/image";
// import Product from "./product";

type ProductListProps = {
  products: ProductType[];
  number: number;
  listPage: boolean;
};

const ProductList = ({ products, number, listPage }: ProductListProps) => {

  return (
    <div className="flex flex-wrap gap-8 lg:gap-6">
      {Array.isArray(products) &&
        products.length > 0 &&
        products.map((product: ProductType) => (
          <Link
            href={listPage ? `/${product.uniqueId}` : "/list"}
            key={product._id}
            className="w-full sm:w-[48%] lg:w-[23%] group"
          >
            <div className="relative w-full aspect-square mb-4 overflow-hidden bg-gray-50 rounded-2xl">
              {product?.images?.[0] && product?.images?.[1] && (
                <>
                  <Image
                    src={product.images[0]}
                    alt="Product Front"
                    fill
                    className="absolute object-cover z-10 group-hover:opacity-0 transition-opacity duration-500"
                    unoptimized
                  />
                  <Image
                    src={product.images[1]}
                    alt="Product Back"
                    fill
                    className="absolute object-cover"
                    unoptimized
                  />
                </>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-start gap-3">
                <h2
                  className="text-base font-medium text-gray-900 leading-tight flex-1"
                  title={product.productTitle}
                >
                  {product.productTitle}
                </h2>
                <p className="text-gray-900 font-medium whitespace-nowrap text-lg">
                  ${product.offerPrice ?? product.basePrice}
                </p>
              </div>

              <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                {product.productDesc}
              </p>

              <button className="text-sm text-gray-600 rounded-full max-w-[140px] h-10 w-full hover:text-[#F35C7A] transition-colors font-medium">
                Add to cart
              </button>
            </div>
          </Link>
        ))}
    </div>
  );
};

export default ProductList;
