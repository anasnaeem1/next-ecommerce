"use client";

interface AddToCartProps {
  disabled?: boolean;
}

const AddToCart = ({ disabled = false }: AddToCartProps) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`group relative flex items-center justify-center gap-3 px-8 py-4 text-white text-base font-medium rounded-xl overflow-hidden transition-all duration-300 ease-out ${
        disabled
          ? "bg-gray-400 cursor-not-allowed opacity-60"
          : "bg-gray-900 hover:bg-gray-800 active:scale-[0.98] cursor-pointer"
      }`}
    >
      <span className="relative z-10 flex items-center gap-3">
        <svg
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 24 24"
          className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
        >
          <circle r="1" cy="21" cx="9"></circle>
          <circle r="1" cy="21" cx="20"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        <span>Add to Cart</span>
      </span>
      
      {/* Hover effect background */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Ripple effect on click */}
      <span className="absolute inset-0 bg-white/10 scale-0 group-active:scale-100 rounded-xl transition-transform duration-300"></span>
    </button>
  );
};

export default AddToCart;
