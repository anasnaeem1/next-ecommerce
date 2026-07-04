import Hero from "../components/Hero";
import CategoryList from "../components/CategoryList";
import Features  from "../components/Features";
import { getNewProducts } from "@/serverActions/product";
import { ProductType } from "@/types";
import ProductList from "../components/ProductList";
import { getFeaturedProduct } from "@/serverActions/product";

const NewProducts = async() => {
  "use client";
  const newProducts = await getNewProducts()

  return (
    <ProductList products={newProducts.products as ProductType[]} New={true} number={4} listPage={false} />
  );
};


async function FeaturedProducts() {
  const featuredProducts = await getFeaturedProduct();

  return (
     <ProductList New={false} products={featuredProducts.products as ProductType[]} number={4} listPage={false} />
  );
}

const HomePage = () => {

  return (
    <div className="">
      <Hero />

      <Features/>

      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl mb-12 font-semibold ">
        Featured Products
        </h1>
        <FeaturedProducts/>
      </div>

      
      <div className="mt-24">
        <CategoryList />
      </div>


      <div className="py-10 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <h1 className="text-2xl font-semibold mb-12 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        New Products
        </h1>
        <NewProducts/>
      </div>
     
    </div>
  );
};

export default HomePage;
