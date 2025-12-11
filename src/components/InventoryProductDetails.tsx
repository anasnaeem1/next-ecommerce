'use client';

import { useState, useEffect, useRef } from 'react';
import VariantsTable from './VariantsTable';
import ProductImagesEditor from './ProductImagesEditor';
import { useProduct } from '../../context/ProductContext';
import {
  handleSaveVariants,
  handleSaveProduct,
  handleCancelEdit,
  handleImagesChange,
} from '../serverActions/Inventory/inventoryActions';

interface InventoryProductDetailsProps {
  product?: {
    productId?: string;
    _id?: string;
    uniqueId?: string;
    productTitle?: string;
    productDesc?: string;
    basePrice?: number;
    offerPrice?: number;
    images?: string[];
    variants?: Array<{
      color: string;
      colorCode?: string;
      sizes: Array<{
        size: string;
        stock: number;
        sku?: string;
        price?: number;
      }>;
    }>;
  };
}


const InventoryProductDetails = ({ product: productProp }: InventoryProductDetailsProps = {}) => {
 
  let productContext: ReturnType<typeof useProduct> | null = null;
  try {
    productContext = useProduct();
  } catch (error) {
    productContext = null;
  }
  
  const product = productContext?.product || productProp;
  
  // Handle loading/error states
  if (!product) {
    if (productContext?.loading) {
      return (
        <div className="w-full flex items-center justify-center py-12">
          <div className="text-gray-500">Loading product...</div>
        </div>
      );
    }
    if (productContext?.error) {
      return (
        <div className="w-full flex items-center justify-center py-12">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Product not found</h2>
            <p className="text-gray-600">{productContext.error}</p>
          </div>
        </div>
      );
    }
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Product not found</h2>
          <p className="text-gray-600">No product data available</p>
        </div>
      </div>
    );
  }

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [productSaveStatus, setProductSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isEditing, setIsEditing] = useState(false);
  
  // Local state for variants - updated after successful save
  const initialVariants = product.variants?.map((variant: any) => ({
    color: variant.color,
    isDefault: variant.isDefault || false,
    sizes: (variant.sizes || []).map((size: any) => ({
      size: size.size,
      stock: size.stock,
      isDefault: size.isDefault || false,
    }))
  })) || [];
  const [currentVariants, setCurrentVariants] = useState(initialVariants);
  const currentVariantsRef = useRef(initialVariants);
  
  // Form state for editable fields - images can be string (URL) or File (new upload)
  const [formData, setFormData] = useState({
    productTitle: product.productTitle || '',
    productDesc: product.productDesc || '',
    basePrice: product.basePrice || 0,
    offerPrice: product.offerPrice || 0,
    images: product.images || [] as (string | File)[],
  });
  
  const [originalData, setOriginalData] = useState({
    productTitle: product.productTitle || '',
    productDesc: product.productDesc || '',
    basePrice: product.basePrice || 0,
    offerPrice: product.offerPrice || 0,
    images: product.images || [] as string[],
  });

  // Check if there are unsaved changes (including image changes)
  const hasImageChanges = formData.images.some((img, idx) => {
    const originalImg = originalData.images[idx];
    if (img instanceof File) return true; // New file uploaded
    if (img !== originalImg) return true; // URL changed
    return false;
  }) || formData.images.length !== originalData.images.length;

  const hasOtherChanges = 
    formData.productTitle !== originalData.productTitle ||
    formData.productDesc !== originalData.productDesc ||
    formData.basePrice !== originalData.basePrice ||
    formData.offerPrice !== originalData.offerPrice;

  const hasUnsavedChanges = hasImageChanges || hasOtherChanges;

  // Update formData when product changes (from context or prop)
  useEffect(() => {
    if (!product) return;
    
    const newFormData = {
      productTitle: product.productTitle || '',
      productDesc: product.productDesc || '',
      basePrice: product.basePrice || 0,
      offerPrice: product.offerPrice || 0,
      images: product.images || [],
    };
    setFormData(newFormData);
    setOriginalData(newFormData);
  }, [(product as any)?._id || (product as any)?.productId]); // Update when product ID changes

  // Update currentVariants when product prop changes (only if content is different)
  useEffect(() => {
    const newVariants = product.variants?.map((variant: any) => ({
      color: variant.color,
      isDefault: variant.isDefault || false,
      sizes: (variant.sizes || []).map((size: any) => ({
        size: size.size,
        stock: size.stock,
        isDefault: size.isDefault || false,
      }))
    })) || [];
    
    // Only update if content is actually different (deep comparison)
    const currentStr = JSON.stringify(currentVariantsRef.current);
    const newStr = JSON.stringify(newVariants);
    if (currentStr !== newStr) {
      setCurrentVariants(newVariants);
      currentVariantsRef.current = newVariants;
    }
  }, [product.variants]);
  
  // Keep ref in sync with state
  useEffect(() => {
    currentVariantsRef.current = currentVariants;
  }, [currentVariants]);

  const onSaveVariants = async (variants: any) => {
    
    const productId = (product as any).uniqueId || productContext?.slug || '';
    return await handleSaveVariants({
      variants,
      productId: productId || '',
      setSaveStatus,
      setIsSaving,
      setCurrentVariants,
      currentVariantsRef,
      refreshProduct: productContext?.refreshProduct,
    });
  };

  const onSaveProduct = async () => {
    const productId = (product as any)._id || (product as any).productId || productContext?.productId;
    const productSlug = (product as any).uniqueId || productContext?.slug;
    
    await handleSaveProduct({
      productId: productId || '',
      productSlug: productSlug || '',
      formData,
      originalData,
      setProductSaveStatus,
      setIsSaving,
      setFormData,
      setOriginalData,
      setIsEditing,
      refreshProduct: productContext?.refreshProduct,
    });
  };

  const onCancelEdit = () => {
    handleCancelEdit({
      originalData,
      setFormData,
      setIsEditing,
    });
  };

  const onImagesChange = (images: (string | File)[]) => {
    handleImagesChange({
      formData,
      images,
      setFormData,
    });
  };

  return (
    <div className="w-full">
      {/* Top Action Bar */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full font-medium">
              Unsaved changes
            </span>
          )}
          {productSaveStatus === 'success' && (
            <span className="text-xs text-green-700 bg-green-50 px-3 py-1 rounded-lg font-medium">
              ✓ Product updated successfully!
            </span>
          )}
          {productSaveStatus === 'error' && (
            <span className="text-xs text-red-700 bg-red-50 px-3 py-1 rounded-lg font-medium">
              ✗ Failed to update product. Please try again.
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Product
            </button>
          )}
          {isEditing && (
            <>
              <button
                onClick={onCancelEdit}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={onSaveProduct}
                disabled={!hasUnsavedChanges || isSaving}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 ${
                  hasUnsavedChanges && !isSaving
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-400 cursor-not-allowed text-white opacity-50'
                }`}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" viewBox="0 0 24 24"></svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Product Title - Compact Style */}
      <div className="mb-8 group">
        <div className="flex items-center gap-3 mb-4">
          {isEditing ? (
            <input
              type="text"
              value={formData.productTitle}
              onChange={(e) => setFormData({ ...formData, productTitle: e.target.value })}
              className="text-2xl md:text-3xl font-light text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <>
              <h1 className="text-2xl md:text-3xl font-light text-gray-900 hover:text-gray-600 transition-colors duration-300 cursor-pointer">
                {formData.productTitle}
              </h1>
              <button className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-1.5 hover:bg-gray-100 rounded-full">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </>
          )}
        </div>
        <div className="w-24 h-px bg-gradient-to-r from-gray-400 to-gray-300"></div>
      </div>

      {/* Product Photo Gallery - Using separate component */}
      <ProductImagesEditor
        images={formData.images}
        isEditing={isEditing}
        onImagesChange={onImagesChange}
        productTitle={product.productTitle}
      />

      {/* Product Description - Compact Style */}
      <div className="mb-6 group">
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-base font-medium text-gray-600 hover:text-gray-600 transition-colors duration-300 cursor-pointer">
            Description
          </h3>
          <button className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-1 hover:bg-gray-100 rounded-full">
            <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
        <div className="relative">
          {isEditing ? (
            <textarea
              value={formData.productDesc}
              onChange={(e) => setFormData({ ...formData, productDesc: e.target.value })}
              className="w-full max-w-3xl text-gray-600 leading-relaxed text-sm border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={5}
            />
          ) : (
            <p className="text-gray-600 leading-relaxed text-sm max-w-3xl hover:bg-gray-50 p-3 rounded-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-200">
              {formData.productDesc}
            </p>
          )}
        </div>
      </div>

      {/* Pricing Section - Compact Style */}
      <div className="mb-6 group">
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-base font-medium text-gray-600 hover:text-gray-600 transition-colors duration-300 cursor-pointer">
            Pricing
          </h3>
          <button className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-1 hover:bg-gray-100 rounded-full">
            <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
        {isEditing ? (
          <div className="flex items-center space-x-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">Base Price</label>
              <input
                type="number"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                className="text-2xl font-light text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">Offer Price (optional)</label>
              <input
                type="number"
                value={formData.offerPrice}
                onChange={(e) => setFormData({ ...formData, offerPrice: parseFloat(e.target.value) || 0 })}
                className="text-2xl font-light text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-4 hover:bg-gray-50 p-4 rounded-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-200">
            <div className="text-2xl font-light text-gray-900 hover:text-gray-600 transition-colors duration-300">
              ${formData.offerPrice || formData.basePrice || 0}
            </div>
            {formData.offerPrice && formData.offerPrice > 0 && (
              <>
                <div className="text-lg text-gray-400 line-through hover:text-gray-500 transition-colors duration-300">
                  ${formData.basePrice || 0}
                </div>
                <div className="text-xs text-green-600 font-medium bg-gradient-to-r from-green-50 to-emerald-50 px-2 py-1 rounded-full border border-green-200 hover:shadow-md transition-all duration-300">
                  Save ${((formData.basePrice || 0) - (formData.offerPrice || 0)).toFixed(2)}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Variants Management Section */}
      <div className="mb-8">
        {saveStatus === 'success' && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
            ✓ Variants saved successfully!
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            <div className="flex items-start gap-2">
              <span>✗</span>
              <div>
                <p className="font-medium">Failed to save variants.</p>
                <p className="text-xs text-red-600 mt-1">Please check the console for details and ensure all validation rules are met.</p>
              </div>
            </div>
          </div>
        )}
        <VariantsTable
        isSaving={isSaving}
        saveStatus={saveStatus}
          productId={(product as any).uniqueId || productContext?.slug || ''}
          initialVariants={currentVariants}
          onVariantsChange={onSaveVariants}
          onTotalStockChange={(totalStock) => {
            console.log('Total stock updated:', totalStock);
          }}
        />
      </div>

    </div>
  );
};

export default InventoryProductDetails;
