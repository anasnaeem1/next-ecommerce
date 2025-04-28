import Image from "next/image";
import Link from "next/link";

const CategoryList = () => {
  return (
    <div className="my-12 scroll-hide overflow-x-auto">
      <div className="flex flex-nowrap gap-6 px-4">
        {Array(7)
          .fill(0)
          .map((_, idx) => (
            <Link
              href="/"
              key={idx}
              className=" min-w-[280px] sm:min-w-[320px] bg-white overflow-hidden hover:shadow-lg transition-shadow rounded-md"
            >
              <div className="relative w-full aspect-[3/4]">
                <Image
                  src="https://img.freepik.com/free-photo/still-life-tech-device_23-2150722606.jpg?t=st=1744840963~exp=1744844563~hmac=f2a91caf657df8f66043f0426519e36bb92d286a4580b19d2524c42f8a6325f4&w=900"
                  alt=""
                  fill
                  sizes="25vw"
                  className="absolute object-cover z-10 rounded-md transition-opacity duration-300 ease-in-out"
                />
              </div>

              <h1 className="py-4 text-gray-600 font-semibold">Category Name</h1>
            </Link>
          ))}
      </div>
    </div>
  );
};
export default CategoryList;
