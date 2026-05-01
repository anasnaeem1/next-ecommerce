import type { MutableRefObject } from "react";
import { updateProduct, updateProductVariant } from "../product";
import { uploadImagesToCloudinary } from "../cloudinary/uploadToCloudinary";
import { deleteImageFromCloudinary } from "../cloudinary/deleteFromcloudinary";

const formatNewVariants = (variants: any[]) =>
  variants.map((v) => ({
    color: v.color,
    colorCode: v.colorCode ?? "",
    isDefault: v.isDefault ?? false,
    sizes: (v.sizes || []).map((s: any) => ({
      size: s.size,
      stock: s.stock,
      sku: s.sku ?? "",
      price: s.price ?? 0,
      isDefault: s.isDefault ?? false,
    })),
  }));

const variantsForUi = (variants: any[]) =>
  variants.map((v) => ({
    color: v.color,
    isDefault: v.isDefault ?? false,
    sizes: (v.sizes || []).map((s: any) => ({
      size: s.size,
      stock: s.stock,
      isDefault: s.isDefault ?? false,
    })),
  }));

interface SaveVariantsParams {
  newVariants: any[];
  uniqueId: string;
  setSaveStatus: (status: "idle" | "success" | "error") => void;
  setIsSaving: (saving: boolean) => void;
  setCurrentVariants: (variants: any[]) => void;
  currentVariantsRef: MutableRefObject<any[]>;
  refreshProduct?: () => Promise<void>;
}

export const handleSaveVariants = async ({
  newVariants,
  uniqueId,
  setSaveStatus,
  setIsSaving,
  setCurrentVariants,
  currentVariantsRef,
  refreshProduct,
}: SaveVariantsParams) => {
  if (!uniqueId) {
    setSaveStatus("error");
    return null;
  }

  setIsSaving(true);
  setSaveStatus("idle");

  try {
    const payload = formatNewVariants(newVariants);
    const result = await updateProductVariant({ productId: uniqueId, variants: payload });
    if (!result.success) {
      setSaveStatus("error");
      return null;
    }

    setSaveStatus("success");
    const list = variantsForUi(result.product?.variants ?? payload);
    setCurrentVariants(list);
    currentVariantsRef.current = list;
    if (refreshProduct) await refreshProduct();
    return list;
  } catch {
    setSaveStatus("error");
    return null;
  } finally {
    setIsSaving(false);
  }
};

interface SaveProductParams {
  uniqueId: string;
  formData: {
    productTitle: string;
    productDesc: string;
    basePrice: number;
    offerPrice: number;
    images: (string | File)[];
    featured : Boolean
  };
  originalData: {
    productTitle: string;
    productDesc: string;
    basePrice: number;
    offerPrice: number;
    images: string[];
    featured : Boolean;
  };
  setProductSaveStatus: (status: "idle" | "success" | "error") => void;
  setIsSaving: (saving: boolean) => void;
  setFormData: (data: any) => void;
  setOriginalData: (data: any) => void;
  setIsEditing: (editing: boolean) => void;
  refreshProduct?: () => Promise<void>;
}

const handleImageChangesInCloudinary = async ({
  originalData,
  formData,
}: Pick<SaveProductParams, "originalData" | "formData">) => {

  const NewImagesUrls: string[] = [];

  const oldProductImages = originalData.images;
  const newProductImages = formData.images;

  // checking if new images are set by user or not 
  const hasImageChanges =
    newProductImages.length !== originalData.images.length ||
    newProductImages.some(
      (img, idx) =>
        img !== originalData.images[idx] ||
        Object.prototype.toString.call(img) === "[object File]"
    );

  
  if (!hasImageChanges) {
    return [...originalData.images];
  }

  
  const imageFiles: File[] = [];
  for (const image of newProductImages) {
    if (typeof image === "string" && image.trim() !== "") {
      NewImagesUrls.push(image);
    } else if (image instanceof File && image.size > 0) {
      imageFiles.push(image);
    }
  }

  if (imageFiles.length > 0) {
    const uploadingNewImages = await uploadImagesToCloudinary(imageFiles);
    if (uploadingNewImages?.urls?.length) {
      NewImagesUrls.push(...uploadingNewImages.urls);
    }
  }

  const deletedImages = oldProductImages.filter(
    (oldImage) => !NewImagesUrls.includes(oldImage)
  );

  for (const image of deletedImages) {
     await deleteImageFromCloudinary(image);
  }

  return NewImagesUrls;
};

export const handleSaveProduct = async ({
  uniqueId,
  formData,
  originalData,
  setProductSaveStatus,
  setIsSaving,
  setFormData,
  setOriginalData,
  setIsEditing,
  refreshProduct,
}: SaveProductParams) => {
  if (!uniqueId) {
    setProductSaveStatus("error");
    return;
  }

  setIsSaving(true);
  setProductSaveStatus("idle");

  try {
    const NewImagesUrls = await handleImageChangesInCloudinary({
      originalData,
      formData,
    });

    const newProduct = {
      id: uniqueId,
      productTitle: formData.productTitle,
      productDesc: formData.productDesc,
      basePrice: formData.basePrice,
      offerPrice: formData.offerPrice > 0 ? formData.offerPrice : undefined,
      images: NewImagesUrls,
      featured: formData.featured
    };

    const result = await updateProduct(newProduct);
    if (!result.success) {
      setProductSaveStatus("error");
      return;
    }

    setProductSaveStatus("success");
    setOriginalData({ ...formData, images: NewImagesUrls as string[] });
    setFormData({ ...formData, images: NewImagesUrls as (string | File)[] });
    setIsEditing(false);
    if (refreshProduct) await refreshProduct();
    setTimeout(() => setProductSaveStatus("idle"), 3000);
  } catch {
    setProductSaveStatus("error");
  } finally {
    setIsSaving(false);
  }
};

interface CancelEditParams {
  originalData: {
    productTitle: string;
    productDesc: string;
    basePrice: number;
    offerPrice: number;
    images: string[];
  };
  setFormData: (data: any) => void;
  setIsEditing: (editing: boolean) => void;
}

export const handleCancelEdit = ({
  originalData,
  setFormData,
  setIsEditing,
}: CancelEditParams) => {
  setFormData({
    ...originalData,
    images: originalData.images as (string | File)[],
  });
  setIsEditing(false);
};

interface HandleImagesChangeParams {
  formData: {
    productTitle: string;
    productDesc: string;
    basePrice: number;
    offerPrice: number;
    images: (string | File)[];
  };
  images: (string | File)[];
  setFormData: (data: any) => void;
}

export const handleImagesChange = ({
  formData,
  images,
  setFormData,
}: HandleImagesChangeParams) => {
  setFormData({ ...formData, images });
};
