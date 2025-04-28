import Image from "next/image";
import Filter from "../../components/Filter";
import ProductList from "@/components/ProductList";

const list = () => {
  return (
    <div className="w-full px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      {/* Campaign */}
      <div className="bg-pink-50 hidden px-4 h-64 items-center justify-between lg:flex">
        {/* Text */}
        <div className="w-2/3 flex-col gap-8 flex items-center justify-center">
          <h1 className="text-4xl font-semibold">
            Grab up to 50% off on <br /> Selected Products
          </h1>
          <button className="rounded-3xl bg-[#F35C7A] text-white w-max py-3 px-5 text-sm">
            Buy Now
          </button>
        </div>
        {/* Image */}
        <div className="relative w-1/3">
          <Image
            src="/woman.png"
            alt="Campaign"
            width={256}
            height={256}
            className="object-contain "
          />
        </div>
      </div>

      {/* Filter */}
      <Filter />

      {/* ProductList */}
      <div className="my-12 ">
        <h1 className="text-2xl font-semibold text-black mb-10">Shoes For You!</h1>
        <ProductList number={8} listPage={true} />
      </div>
    </div>
  );
};
export default list;
