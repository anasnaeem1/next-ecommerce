import Hero from "../components/Hero";
import ProductList from "../components/ProductList";
import CategoryList from "../components/CategoryList";
import { getFeaturedProduct, getNewProducts } from "@/serverActions/product";
import { ProductType } from "@/types";

const FeaturedProducts = async() => {
  "use client";
  const featuredProducts = await getFeaturedProduct()

  return (
    <ProductList products={featuredProducts.products as ProductType[]} number={4} listPage={false} />
  );
};

const NewProducts = async() => {
  "use client";
  const newProducts = await getNewProducts()

  return (
    <ProductList products={newProducts.products as ProductType[]} number={4} listPage={false} />
  );
};

const HomePage = () => {

  return (
    <div className="">
      <Hero />

      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl mb-12 font-semibold ">
        Featured Products
        </h1>
        <FeaturedProducts/>
      </div>

      
      <div className="mt-24">
        <h1 className="text-2xl  font-semibold px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
          Categories
        </h1>
        <CategoryList />
      </div>


      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl font-semibold mb-12 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        New Products
        </h1>
        <NewProducts/>
      </div>
     
    </div>
  );
};

export default HomePage;
