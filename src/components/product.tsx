// "use client";
// import { ProductType } from "@/types";
// import Link from "next/link";

// type Product = {
//   product: ProductType;
//   listPage: boolean;
// };

// const product = ({ product, listPage }: Product) => {
//   // const [image1, setImage1] = useState("");
//   // const [image2, setImage2] = useState("");

//   // useEffect(() => {
//   //   if (Array.isArray(product?.images) && product.images.length > 0) {
//   //     const img1 = String(product.images[0] ?? "");
//   //     const img2 = String(product.images[1] ?? "");

//   //     console.log("product:", product);
//   //     console.log("product.images:", product?.images);
//   //     console.log("typeof product.images[0]:", typeof product?.images?.[0]);
//   //     console.log("image11:", image11);

//   //     setImage1(img1);
//   //     setImage2(img2);
//   //   }
//   // }, [product]);
//   // const image =
//   //   "https://res.cloudinary.com/datcr1zua/image/upload/v1752800263/urban-buy/tgavra5avoahzlkuclwq.webp";
//   // const image11 = String(product?.images?.[0] ?? "");

//   return (
//     <>
//       <div className="relative w-full aspect-square">
//         {product?.images?.[0] && (
//           <img
//             src={product.images[0]}
//             alt={product.images[0]}
//             className="absolute object-cover z-10 rounded-md hover:opacity-0 transition-opacity duration-300 w-full h-full"
//           />
//         )}

//         <img
//           src="https://img.freepik.com/free-photo/modern-wireless-earphones-with-case-simple-concrete-background_23-2150808007.jpg?t=st=1744841065~exp=1744844665~hmac=a4cc1641e63d56b4c7e93d56ebbd2bef51e7c9b75caf9ba86a46030978f869b6&w=740"
//           alt=""
//           className="absolute object-cover rounded-md w-full h-full"
//         />
//       </div>

//       <div className="p-4 flex flex-col gap-3">
//         <div className="flex justify-between items-center">
//           <h2 className="text-lg font-semibold">
//             {/* {product.images?.[0]} */}

//             {product.productTitle}
//           </h2>
//           <p className="text-gray-600">
//             ${product.offerPrice ?? product.price}
//           </p>
//         </div>
//         <p className="text-gray-500 line-clamp-2">{product.productDesc}</p>
//         <button className="border text-sm text-pink-500 border-pink-500 rounded-full max-w-[120px] h-10 w-full hover:bg-pink-600 hover:text-white transition-all">
//           Add to cart
//         </button>
//       </div>
//     </>
//   );
// };
// export default product;
