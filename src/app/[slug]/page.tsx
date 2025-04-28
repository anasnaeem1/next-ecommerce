import Image from "next/image";
import ProductImages from "../../components/ProductImages";
import CustomizeSection from "../../components/CustomizeSection";
import Add from "../../components/Add";

const Page = () => {
  const productDetails = {
    name: "Product Name",
    description: "Detailed description of the product.",
    price: 199,
    colors: [
      { label: "Red", availability: true },
      { label: "Blue", availability: true },
      { label: "Green", availability: false },
    ],
    sizes: [
      { label: "Small", availability: true },
      { label: "Medium", availability: true },
      { label: "Large", availability: false },
    ],
  };

  return (
    <div className=" px-4 py-6 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex justify-between gap-10">
      <div className="w-full lg:w-1/2 lg:sticky top-20 h-max relative">
        <ProductImages />
      </div>

      <div className="w-1/2 flex flex-col gap-4">
        <h1 className="text-4xl font-semibold mb-2">{productDetails.name}</h1>
        <p className="text-gray-600 mb-4">{productDetails.description}</p>
        <hr />
        <div className="flex items-center gap-4">
          <h2 className="text-xl text-gray-500 line-through">$45</h2>
          <h3 className="text-2xl font-semibold">$40.5</h3>
        </div>
        <hr />
        <CustomizeSection
          sizes={productDetails.sizes}
          colors={productDetails.colors}
        />
        <Add />
        <hr />
        <div className="mt-2 flex flex-col gap-5">
          <h1 className="text-md font-semibold uppercase">Product Info</h1>
          <p className="text-md text-gray-800">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam
            veritatis animi obcaecati nulla cumque quidem beatae architecto
            repudiandae consectetur, non, saepe doloremque consequuntur labore
            fuga hic voluptatum vitae! Laudantium, nihil.
          </p>
        </div>
        <div className="mt-2 flex flex-col gap-5">
          <h1 className="text-md font-semibold uppercase">
            Return & Refund Policy
          </h1>
          <p className="text-md text-gray-800">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam
            veritatis animi obcaecati nulla cumque quidem beatae architecto
            repudiandae consectetur, non, saepe doloremque consequuntur labore
            fuga hic voluptatum vitae! Laudantium, nihil.
          </p>
        </div>
        <div className="mt-2 flex flex-col gap-5">
          <h1 className="text-md font-semibold uppercase">Shopping Info</h1>
          <p className="text-md text-gray-800">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam
            veritatis animi obcaecati nulla cumque quidem beatae architecto
            repudiandae consectetur, non, saepe doloremque consequuntur labore
            fuga hic voluptatum vitae! Laudantium, nihil.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
