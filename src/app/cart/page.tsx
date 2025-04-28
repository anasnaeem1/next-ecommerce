import Image from "next/image";
import Filter from "../../components/Filter";
import ProductList from "@/components/ProductList";
import QuantitySelector from "../../components/QuantitySelector";

const Cart = () => {
  const productImage: string =
    "https://img.freepik.com/free-photo/still-life-tech-device_23-2150722606.jpg?t=st=1744840963~exp=1744844563~hmac=f2a91caf657df8f66043f0426519e36bb92d286a4580b19d2524c42f8a6325f4&w=900";

  const product = {
    price: 399,
    quantity: 2,
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex flex-col lg:flex-row gap-8 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 mt-10">
      {/* Left Section - Cart Items */}
      <div className="flex flex-col gap-6 w-full lg:w-3/4">
        <div className="mt-4 flex justify-between items-center">
          <h1 className="text-3xl font-semibold">
            Your <span className="text-pink-500">Cart</span>
          </h1>
          <span className="text-gray-600 text-lg">1 Item</span>
        </div>

        <hr />
        <div>
          {/* Headers */}
          <div className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded">
            <span className="text-gray-700 font-semibold flex-grow">
              Product Details
            </span>
            <span className="text-gray-700 font-semibold w-1/5 text-center">
              Price
            </span>
            <span className="text-gray-700 font-semibold w-1/5 text-center">
              Quantity
            </span>
            <span className="text-gray-700 font-semibold w-1/5 text-center">
              Subtotal
            </span>
          </div>

          <div className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded">
            <div className="flex items-center gap-4 w-2/5">
              <Image
                src={productImage}
                alt="Product"
                width={100}
                height={100}
                className="object-cover rounded-md"
              />
              <div>
                <h1 className="text-gray-700">Apple Airpods pro 2nd gen</h1>
                <button className="text-pink-500 font-medium text-sm">
                  Remove
                </button>
              </div>
            </div>
            <span className="text-gray-700 font-semibold w-1/5 text-center">
              {product.price}$
            </span>
            <QuantitySelector defaultQuantity={product?.quantity} />

            <span className="text-gray-700 font-semibold w-1/5 text-center">
              {product.price * product.quantity}$
            </span>
          </div>
        </div>

        {/* Continue Shopping */}
        <button className="flex items-center text-black hover:text-pink-500 transition-all duration-300 group w-fit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 1024 1024"
            className="mr-2 fill-current transition-transform duration-300 group-hover:-translate-x-1"
          >
            <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z" />
          </svg>
          <span className="text-sm sm:text-base font-medium">
            Continue Shopping
          </span>
        </button>
      </div>

      {/* Right Section - Summary */}
      <div className="w-full h-max max-w-md bg-white rounded-2xl p-8 space-y-8 border border-gray-300">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-gray-900">Order Summary</h2>
        <hr className="border-gray-200" />

        {/* Address Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-600 uppercase">
            Select Address
          </label>
          <select className="w-full py-2 px-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition">
            <option value="">Choose an option</option>
            <option value="earphone">Earphone</option>
            <option value="headphone">Headphone</option>
            <option value="airpods">AirPods</option>
          </select>
        </div>

        {/* Price Input */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-600">
            Discount Code / Price
          </label>
          <input
            type="number"
            placeholder="Enter amount"
            className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
          />
        </div>

        <button className="w-full max-w-[150px] bg-pink-600 hover:bg-pink-700 text-white font-semibold text-sm py-3 rounded-lg transition">
          Apply
        </button>

        <hr className="border-gray-200" />

        {/* Price Breakdown */}
        <div className="space-y-4 text-sm text-gray-700">
          <div className="flex justify-between">
            <span className="font-medium">Items (0)</span>
            <span className="text-black font-semibold">$0.00</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Shipping Fee</span>
            <span className="text-black font-semibold">Free</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Tax (2%)</span>
            <span className="text-black font-semibold">$0.00</span>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Total */}
        <div className="flex justify-between items-center text-xl font-bold text-gray-900">
          <span>Total</span>
          <span>$0.00</span>
        </div>

        {/* Place Order Button */}
        <button className="w-full bg-pink-600 hover:bg-pink-700 text-white text-base font-semibold py-3 rounded-xl transition">
          Place Order
        </button>
      </div>
    </div>
  );
};
export default Cart;
