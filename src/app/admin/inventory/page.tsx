import Product from "../../../../models/Product.js";
import { connectDb } from "../../../../config/db.js";
import { ProductType } from "@/types";
import InventoryRow from "../../../components/InventoryRow";
import { getProducts } from "@/serverActions/Product./productActions.js";

export const dynamic = "force-dynamic";

const Inventory = async () => {
  await connectDb();

  const { success, products, message } = await getProducts();
  const productList: ProductType[] = products || [];


  return (
    <div className="flex flex-col gap-5 h-full">
      <h1 className="text-lg text-black font-medium">Inventory Management</h1>
      <div className="w-full bg-white h-full border border-gray-200">
        <div className="py-3 px-4 flex justify-between items-center border-b border-gray-200 h-[60px]">
          <div className="flex-grow">
            <h1 className="font-semibold text-gray-700">Product</h1>
          </div>
          <div className="flex-none w-1/6">
            <h1 className="font-semibold text-gray-700">Unique ID</h1>
          </div>
          <div className="flex-none w-1/6">
            <h1 className="font-semibold text-gray-700">Variant</h1>
          </div>
          <div className="flex-none w-1/6">
            <h1 className="font-semibold text-gray-700">Quantity</h1>
          </div>
          <div className="flex-none w-1/6">
            <h1 className="font-semibold text-gray-700">Action</h1>
          </div>
        </div>
        {/* Adjusting height and overflow for the list */}
        <ul className="w-full max-h-[690px] overflow-y-auto scrollbar-pink">
          {productList.map((product) => (
            <InventoryRow key={product._id} product={product} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Inventory;
