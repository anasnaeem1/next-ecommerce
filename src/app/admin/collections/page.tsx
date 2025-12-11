import Image from "next/image";

const Collections = () => {
  const productImage: string =
    "https://img.freepik.com/free-photo/still-life-tech-device_23-2150722606.jpg?t=st=1744840963~exp=1744844563~hmac=f2a91caf657df8f66043f0426519e36bb92d286a4580b19d2524c42f8a6325f4&w=900";

  return (
    <div className="flex flex-col gap-5 h-full">
      <h1 className="text-lg text-black font-medium">All Products</h1>
      <div className="max-w-full w-full bg-white h-full border border-gray-200">
        <div className="py-3 px-4 flex justify-between items-center border-b border-gray-200 h-[60px]">
          <div className="flex-grow">
            <h1 className="font-semibold text-gray-700">Product</h1>
          </div>
          <div className="flex-none w-1/5">
            <h1 className="font-semibold text-gray-700">Category</h1>
          </div>
          <div className="flex-none w-1/5">
            <h1 className="font-semibold text-gray-700">Price</h1>
          </div>
          <div className="flex-none w-1/5">
            <h1 className="font-semibold text-gray-700">Action</h1>
          </div>
        </div>
        {/* Adjusting height and overflow for the list */}
        <ul className="w-full max-h-[690px] overflow-y-auto scrollbar-pink">
          {Array.from({ length: 10 }, (_, index) => (
            <li
              key={index}
              className="p-4 w-full flex justify-between items-center border-t border-gray-200"
            >
              <div className="flex items-center gap-4 w-2/5">
                <Image
                  src={productImage}
                  alt="Product"
                  width={100}
                  height={100}
                  className="object-cover rounded-md"
                />
                <h1 className="text-gray-700">Apple Airpods pro 2nd gen</h1>
              </div>

              <div className="flex-none w-1/5">
                <h1 className="text-gray-600">Earphone</h1>
              </div>
              <div className="flex-none w-1/5">
                <h1 className="text-gray-600">$399</h1>
              </div>
              <div className="flex-none w-1/5">
                <button className="bg-gray-500 gap-2 text-white py-2 px-4 rounded-lg flex items-center hover:bg-gray-600 transition duration-200">
                  Visit
                  <img src="/visit.svg" className="w-4 h-4" alt="" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Collections;
