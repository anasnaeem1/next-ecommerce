import { 
  saveVariantChanges, 
  getProductVariants,
} from '../ProductVariants/productVariants';
import { updateProduct } from '../product';

interface SaveVariantsParams {
  variants: any[];
  productId: string;
  setSaveStatus: (status: 'idle' | 'success' | 'error') => void;
  setIsSaving: (saving: boolean) => void;
  setCurrentVariants: (variants: any[]) => void;
  currentVariantsRef: React.MutableRefObject<any[]>;
  refreshProduct?: () => Promise<void>;
}

export const handleSaveVariants = async ({
  variants,
  productId,
  setSaveStatus,
  setIsSaving,
  setCurrentVariants,
  currentVariantsRef,
  refreshProduct,
}: SaveVariantsParams) => {
  if (!productId) {
    console.error('Product ID is missing');
    return null;
  }

  setIsSaving(true);
  setSaveStatus('idle');

  try {
    const formattedVariants = variants.map((variant: any) => ({
      color: variant.color,
      colorCode: variant.colorCode || '',
      isDefault: variant.isDefault || false,
      sizes: variant.sizes.map((size: any) => ({
        size: size.size,
        stock: size.stock,
        sku: size.sku || '',
        price: size.price || 0,
        isDefault: size.isDefault || false,
      })),
    }));

    const result: any = await saveVariantChanges(productId, formattedVariants);

    if (result.success) {
      setSaveStatus('success');

      try {
        const updatedVariantsResult: any = await getProductVariants(productId);

        if (updatedVariantsResult?.success && updatedVariantsResult?.variants) {
          const updatedVariants = updatedVariantsResult.variants.map((variant: any) => ({
            color: variant.color,
            isDefault: variant.isDefault || false,
            sizes: (variant.sizes || []).map((size: any) => ({
              size: size.size,
              stock: size.stock,
              isDefault: size.isDefault || false,
            })),
          }));
          setCurrentVariants(updatedVariants);
          currentVariantsRef.current = updatedVariants;
        } else {
          const fallbackVariants = formattedVariants.map((v: any) => ({
            color: v.color,
            isDefault: v.isDefault || false,
            sizes: (v.sizes || []).map((size: any) => ({
              size: size.size,
              stock: size.stock,
              isDefault: size.isDefault || false,
            })),
          }));
          setCurrentVariants(fallbackVariants);
          currentVariantsRef.current = fallbackVariants;
        }
      } catch (fetchError) {
        const fallbackVariants = formattedVariants.map((v: any) => ({
          color: v.color,
          isDefault: v.isDefault || false,
          sizes: (v.sizes || []).map((size: any) => ({
            size: size.size,
            stock: size.stock,
            isDefault: size.isDefault || false,
          })),
        }));
        setCurrentVariants(fallbackVariants);
        currentVariantsRef.current = fallbackVariants;
      }

      if (refreshProduct) {
        await refreshProduct();
      }

      return formattedVariants;
    } else {
      setSaveStatus('error');
      const errorMessage = result?.message || 'Unknown error occurred';
      const errorDetails = result?.details || result?.errors?.join('; ') || 'No details available';
      console.error('Failed to save variants:', errorMessage);
      console.error('Error details:', errorDetails);
      console.error('Full error result:', result);
      return null;
    }
  } catch (error: any) {
    setSaveStatus('error');
    const errorMessage = error?.message || 'Unknown error occurred';
    console.error('Error saving variants:', errorMessage);
    console.error('Full error:', error);
    return null;
  } finally {
    setIsSaving(false);
  }
};

interface SaveProductParams {
  productId: string;
  productSlug: string;
  formData: {
    productTitle: string;
    productDesc: string;
    basePrice: number;
    offerPrice: number;
    images: (string | File)[];
  };
  originalData: {
    productTitle: string;
    productDesc: string;
    basePrice: number;
    offerPrice: number;
    images: string[];
  };
  setProductSaveStatus: (status: 'idle' | 'success' | 'error') => void;
  setIsSaving: (saving: boolean) => void;
  setFormData: (data: any) => void;
  setOriginalData: (data: any) => void;
  setIsEditing: (editing: boolean) => void;
  refreshProduct?: () => Promise<void>;
}

export const handleSaveProduct = async ({
  productId,
  productSlug,
  formData,
  originalData,
  setProductSaveStatus,
  setIsSaving,
  setFormData,
  setOriginalData,
  setIsEditing,
  refreshProduct,
}: SaveProductParams) => {
  if (!productId || !productSlug) {
    console.error('Product ID or slug is missing');
    setProductSaveStatus('error');
    return;
  }

  setIsSaving(true);
  setProductSaveStatus('idle');

  try {
    const hasImageChanges = formData.images.some((img, idx) => {
      const originalImg = originalData.images[idx];
      if (img instanceof File) return true;
      if (img !== originalImg) return true;
      return false;
    }) || formData.images.length !== originalData.images.length;

    let finalImageUrls = formData.images.map(img => typeof img === 'string' ? img : '');

    // If images were changed, handle image updates
    if (hasImageChanges) {
      const formDataToSend = new FormData();
      formDataToSend.append("productId", productId);
      
      // Prepare image data array - only for images that are File objects
      const imagesData = formData.images.map((img, index) => {
        const originalImg = originalData.images[index] || '';
        if (img instanceof File) {
          return {
            index,
            oldUrl: originalImg
          };
        }
        return null;
      }).filter(item => item !== null);

      formDataToSend.append("images", JSON.stringify(imagesData));
      formDataToSend.append("oldImages", JSON.stringify(originalData.images));

      // Append new files with their index
      formData.images.forEach((img, index) => {
        if (img instanceof File) {
          formDataToSend.append(`image_${index}`, img);
        }
      });

      // Send image update request
      const imageResponse = await fetch("/api/update-product-images", {
        method: "POST",
        body: formDataToSend,
      });

      const imageResult = await imageResponse.json();

      if (!imageResult.success) {
        setProductSaveStatus('error');
        console.error('Failed to update images:', imageResult.message);
        setIsSaving(false);
        return;
      }

      finalImageUrls = imageResult.images;
    }

    // Update other product fields
    const productToUpdate = {
      uniqueId: productSlug,
      productTitle: formData.productTitle,
      productDesc: formData.productDesc,
      basePrice: formData.basePrice,
      offerPrice: formData.offerPrice > 0 ? formData.offerPrice : undefined,
      images: finalImageUrls,
    };

    const result = await updateProduct(productToUpdate);

    if (result.success) {
      setProductSaveStatus('success');
      // Update originalData with final URLs (convert Files to strings)
      setOriginalData({
        ...formData,
        images: finalImageUrls as string[],
      });
      // Update formData to use URLs instead of Files
      setFormData({
        ...formData,
        images: finalImageUrls as (string | File)[],
      });
      setIsEditing(false);
      console.log('Product updated successfully:', result);
      
      // Refresh product data from context if available
      if (refreshProduct) {
        await refreshProduct();
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setProductSaveStatus('idle'), 3000);
    } else {
      setProductSaveStatus('error');
      console.error('Failed to update product:', result.message);
    }
  } catch (error) {
    setProductSaveStatus('error');
    console.error('Error updating product:', error);
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
  // Reset formData to originalData, converting images back to strings
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

