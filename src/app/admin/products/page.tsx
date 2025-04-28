import FilesUploader from "../../../components/filesUploader";

const Products = () => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg text-black font-medium">Product Image</h1>
        <FilesUploader />
      </div>
      <div>
        <h1 className="text-lg text-black font-medium mb-3">Product Title</h1>
        <input
          placeholder="Enter Product Title"
          type="text"
          className="w-full max-w-xl py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-500 transition duration-200"
        />
      </div>
      <div>
        <h1 className="text-lg text-black font-medium mb-3">
          Product Description
        </h1>
        <textarea
          placeholder="Enter product description"
          rows={3}
          className="w-full max-w-xl py-3 px-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-500 transition duration-200"
        />
      </div>

      <div className="flex gap-6 max-w-[600px] w-full">
        {/* Category Select */}
        <div className="flex-1">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            className="w-full py-2 px-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-500 transition"
          >
            <option value="">Select a category</option>
            <option value="earphone">Earphone</option>
            <option value="headphone">Headphone</option>
            <option value="airpods">AirPods</option>
          </select>
        </div>

        {/* Price Input */}
        <div className="flex-1">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Price
          </label>
          <input
            id="price"
            name="price"
            type="number"
            placeholder="0"
            className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-500 transition"
          />
        </div>

        {/* Stock Input */}
        <div className="flex-1">
          <label
            htmlFor="offerPrice"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Offer Price
          </label>
          <input
            id="offerPrice"
            name="offerPrice"
            type="number"
            placeholder="0"
            className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-500 transition"
          />
        </div>
      </div>
    </div>
  );
};

export default Products;
