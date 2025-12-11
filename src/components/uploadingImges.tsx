// // "use client";
// // import React from "react";
// import axios from "axios";
// import Product from "../../models/Product";
// import { uploadImagesToCloudinary, addDummyProduct } from "../apiCalls/product";

// type ImageData = {
//   index: number;
//   image: string;
//   file?: File;
// };

// const UploadingImages = ({ images }: { images: ImageData[] }) => {
 
//   const handleSavedImages = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const formData = new FormData();

//       images.forEach((imageFile: ImageData) => {
//         if (imageFile.file) {
//           formData.append("images", imageFile.file);
//         }
//       });

//       const response = await axios.post("/api/add-product-images", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       console.log("Uploaded URLs:", response.data);
//     } catch (error) {
//       console.error("Image upload failed:", error);
//     }
//   };

//   return (
//     <button
//       onClick={handleSavedImages}
//       className="bg-pink-500 text-white max-w-[200px] text-sm font-medium px-4 py-2 rounded-lg shadow-sm hover:bg-pink-600 transition duration-200"
//     >
//       Save Images
//     </button>
//   );
// };

// export default UploadingImages;
