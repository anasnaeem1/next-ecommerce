import { v2 as cloudinary } from "cloudinary";
// import formidable from "formidable";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImagesToCloudinary = async (imagesArray) => {
  await connectDb();
  const uploadedImageUrls = [];

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_API_KEY;

  for (const image of imagesArray) {
    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", uploadPreset);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/urban-buy`,
        formData
      );

      uploadedImageUrls.push(response.data.secure_url);
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  }

  return uploadedImageUrls;
};
