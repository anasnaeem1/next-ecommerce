import list from "@/app/list/page";
import Image from "next/image";
import Link from "next/link";

type ProductListProps = {
  number: number;
  listPage: boolean;
};

const ProductList = ({ number, listPage }: ProductListProps) => {
  return (
    <div className=" flex flex-wrap justify-between gap-y-16">
      {Array(number)
        .fill(0)
        .map((_, idx) => (
          <Link
            href={`${listPage ? "/singleProduct" : "/list"}`}
            key={idx}
            className="w-full sm:w-[48%] lg:w-[23%] bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative w-full aspect-square">
              <Image
                src="https://img.freepik.com/free-photo/still-life-tech-device_23-2150722606.jpg?t=st=1744840963~exp=1744844563~hmac=f2a91caf657df8f66043f0426519e36bb92d286a4580b19d2524c42f8a6325f4&w=900"
                alt=""
                fill
                sizes="25vw"
                className="absolute object-cover z-10 rounded-md hover:opacity-0 transition-opacity duration-300 ease-in-out"
              />
              <Image
                src="https://img.freepik.com/free-photo/modern-wireless-earphones-with-case-simple-concrete-background_23-2150808007.jpg?t=st=1744841065~exp=1744844665~hmac=a4cc1641e63d56b4c7e93d56ebbd2bef51e7c9b75caf9ba86a46030978f869b6&w=740"
                alt=""
                fill
                sizes="25vw"
                className="absolute object-cover rounded-md"
              />
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="flex justify-between">
                <h2 className="text-lg font-semibold">Product Name</h2>
                <p className="text-gray-600">$199</p>
              </div>
              <p className="text-gray-500">My description</p>
              <button className="border text-sm hover:bg-pink-600 hover:text-white transition-all duration-300 text-pink-500 border-pink-500 rounded-full max-w-[120px] h-10 w-full">
                Add to cart
              </button>
            </div>
          </Link>
        ))}
    </div>
  );
};

export default ProductList;
