import Image from "next/image";

const Orders = () => {
  return (
    <div className="max-w-[1300px]  h-full w-full flex flex-col gap-6">
      <h1 className="text-lg text-black font-medium">Orders</h1>
      <ul className="flex px-5 flex-col gap-3 w-full h-full overflow-y-auto scrollbar-pink">
        {Array.from({ length: 10 }, (_, index) => (
          <span className="flex flex-col gap-6" key={index}>
            <hr />
            <li className="flex justify-between">
              {/* Order Icon And Names */}
              <div className="flex gap-5">
                <div className="bg-gray-100 flex items-center border-gray-300 border justify-center w-20 h-20 rounded-md transition-all duration-300 cursor-pointer">
                  <Image
                    src="/Order.svg"
                    alt="Product"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h1>
                    Samsung Galaxy S23 x 1, Apple <br /> Airpods pro 2nd gen x 2
                  </h1>
                  <span>items 2</span>
                </div>
              </div>

              {/* Order Address */}
              <div className="font-normal text-md">
                <h1 className="uppercase font-medium">Urban</h1>
                <h2>Main Street, Main Road, 123 Colony</h2>
                <h2>City, State</h2>
                <h2>98473764721</h2>
              </div>

              {/* Order Price */}
              <div className="font-medium flex items-center justify-center text-md">
                <h1>$1630.97</h1>
              </div>

              {/* Order Status */}
              <div className="font-normal text-md">
                <ul>
                  <li className="font-medium">
                    Method: <span>COD</span>
                  </li>
                  <li className="font-medium">
                    Date: <span>2/7/2025</span>
                  </li>
                  <li className="font-medium">
                    Payment: <span>Pending</span>
                  </li>
                </ul>
              </div>
            </li>
          </span>
        ))}
      </ul>
    </div>
  );
};
export default Orders;
