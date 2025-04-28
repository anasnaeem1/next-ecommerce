import Image from "next/image";
import Link from "next/link";

const CartDropdown = () => {
  const cartItems = true;

  return (
    <div className="w-max absolute z-10 top-2 -right-6 rounded-md border p-4 shadow-lg bg-white">
      {!cartItems ? (
        <div>Cart is empty</div>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-lg font-semibold">Shopping Cart</h1>

          {/* Cart Item */}
          <div className="flex gap-4 items-start cursor-pointer transition-all duration-300">
            {/* Product Image */}
            <div className="relative w-[100px] h-[120px] shrink-0 rounded-md overflow-hidden">
              <Image
                src="https://img.freepik.com/free-photo/still-life-tech-device_23-2150722606.jpg?t=st=1744840963~exp=1744844563~hmac=f2a91caf657df8f66043f0426519e36bb92d286a4580b19d2524c42f8a6325f4&w=900"
                alt="Product"
                fill
                className="object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-between gap-5 w-full">
              <div>
                <div className="flex justify-between items-center">
                  <h2 className="text-base font-medium text-gray-800">
                    Headphones
                  </h2>
                  <p className="text-sm font-semibold text-blue-600">$59.99</p>
                </div>
                <p className="text-sm text-gray-500">Available</p>
              </div>

              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">Qty: 1</p>
                <button className="text-sm text-red-500 hover:underline">
                  Remove
                </button>
              </div>
            </div>
          </div>

          {/* Subtotal and Buttons */}
          <div>
            <div className="flex justify-between mb-2">
              <p className="text-base font-semibold">Subtotal:</p>
              <p className="text-base font-semibold text-blue-600">$59.99</p>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Taxes and shipping calculated at checkout.
            </p>
            <div className="flex justify-between gap-2">
              <Link href="/cart">
                <button className="w-full border px-4 py-2 rounded-md hover:bg-gray-50 transition">
                  View Cart
                </button>
              </Link>
              <Link href="/checkout">
                <button className="w-full bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition">
                  Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartDropdown;
