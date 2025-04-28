"use client";

const AddToCart = () => {
  return (
    <>
      <input hidden id="cart-toggle" type="checkbox" />

      <label
        htmlFor="cart-toggle"
        className="relative flex items-center gap-2 px-6 py-3 text-white text-base font-medium rounded-full cursor-pointer overflow-hidden transition-all duration-300 ease-in-out shadow-md shadow-pink-500/30 bg-gradient-to-br from-pink-500 to-pink-600 hover:scale-105 hover:shadow-lg active:scale-95 font-[Poppins]"
      >
        <span className="cart-icon transition-transform duration-300">
          <svg
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24"
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle r="1" cy="21" cx="9"></circle>
            <circle r="1" cy="21" cx="20"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </span>
        Add to Cart
        {/* Progress Bar on Hover */}
        <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-white/80 group-hover:w-full transition-all duration-[1s] ease-in-out"></div>
        {/* Shine Animation */}
        <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shine_2s_linear_infinite]" />
      </label>

      {/* Custom Shine Animation Keyframes */}
      <style jsx>{`
        @keyframes shine {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default AddToCart;
