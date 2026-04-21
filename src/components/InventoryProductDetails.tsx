'use client';

import { useState, useEffect, useRef, useContext } from 'react';
import VariantsTable from './VariantsTable';
import ProductImagesEditor from './ProductImagesEditor';
import { ProductContext } from '../../context/ProductContext';
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


// Safe hook that doesn't throw if context is not available
function useProductSafe() {
  const context = useContext(ProductContext);
  return context || null;
}

const InventoryProductDetails = ({ product: productProp }: InventoryProductDetailsProps = {}) => {
  // Always call hooks first, before any conditional logic
  const productContext = useProductSafe();
  const product = productContext?.product || productProp;
  
  // Initialize all state hooks at the top
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [productSaveStatus, setProductSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isEditing, setIsEditing] = useState(false);
  
  // Local state for variants - updated after successful save
  const initialVariants = product?.variants?.map((variant: any) => ({
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
    productTitle: product?.productTitle || '',
    productDesc: product?.productDesc || '',
    basePrice: product?.basePrice || 0,
    offerPrice: product?.offerPrice || 0,
    images: product?.images || [] as (string | File)[],
  });
  
  const [originalData, setOriginalData] = useState({
    productTitle: product?.productTitle || '',
    productDesc: product?.productDesc || '',
    basePrice: product?.basePrice || 0,
    offerPrice: product?.offerPrice || 0,
    images: product?.images || [] as string[],
  });

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
  }, [product]); // Update when product changes

  // Update currentVariants when product prop changes (only if content is different)
  useEffect(() => {
    if (!product) return;
    
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
  }, [product]);
  
  // Keep ref in sync with state
  useEffect(() => {
    currentVariantsRef.current = currentVariants;
  }, [currentVariants]);
  
  // Handle loading/error states - after all hooks
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
    <div className="w-full border border-slate-300 rounded-md bg-slate-50 p-5 md:p-6">
      {/* Top Action Bar */}
      <div className="mb-5 flex items-center justify-between border border-slate-300 rounded-md bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <span className="text-xs text-amber-700 bg-white border border-amber-300 px-2 py-1 rounded-md font-semibold">
              Unsaved changes
            </span>
          )}
          {productSaveStatus === 'success' && (
            <span className="text-xs text-green-700 bg-white border border-green-300 px-3 py-1 rounded-md font-semibold">
              ✓ Product updated successfully!
            </span>
          )}
          {productSaveStatus === 'error' && (
            <span className="text-xs text-red-700 bg-white border border-red-300 px-3 py-1 rounded-md font-semibold">
              ✗ Failed to update product. Please try again.
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-400 bg-white text-slate-800 hover:bg-slate-100 rounded-md transition-colors duration-200"
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
                className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={onSaveProduct}
                disabled={!hasUnsavedChanges || isSaving}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 ${
                  hasUnsavedChanges && !isSaving
                    ? 'border border-indigo-700 bg-indigo-700 hover:bg-indigo-800 text-white'
                    : 'border border-slate-300 bg-slate-100 cursor-not-allowed text-slate-400'
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
      <div className="mb-5 border border-slate-300 rounded-md bg-white">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-700">Product Title</h3>
        </div>
        <div className="p-5 md:p-6">
          {isEditing ? (
            <input
              type="text"
              value={formData.productTitle}
              onChange={(e) => setFormData({ ...formData, productTitle: e.target.value })}
              className="w-full text-2xl md:text-3xl font-semibold text-gray-900 border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:border-indigo-300"
            />
          ) : (
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
              {formData.productTitle}
            </h1>
          )}
        </div>
      </div>

      {/* Product Photo Gallery - Using separate component */}
      <div className="mb-5 border border-slate-300 rounded-md bg-white">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-700">Product Images</h3>
        </div>
        <div className="p-5 md:p-6">
          <ProductImagesEditor
            images={formData.images}
            isEditing={isEditing}
            onImagesChange={onImagesChange}
            productTitle={product.productTitle}
          />
        </div>
      </div>

      {/* Product Description - Compact Style */}
      <div className="mb-5 border border-slate-300 rounded-md bg-white">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-700">Description</h3>
        </div>
        <div className="relative p-5 md:p-6">
          {isEditing ? (
            <textarea
              value={formData.productDesc}
              onChange={(e) => setFormData({ ...formData, productDesc: e.target.value })}
              className="w-full max-w-3xl text-gray-700 leading-relaxed text-sm border border-slate-300 rounded-md p-3 focus:outline-none focus:border-indigo-300 resize-none"
              rows={5}
            />
          ) : (
            <p className="text-gray-700 leading-relaxed text-sm max-w-3xl p-3 rounded-md border border-gray-300 bg-white">
              {formData.productDesc}
            </p>
          )}
        </div>
      </div>

      {/* Pricing Section - Compact Style */}
      <div className="mb-5 border border-slate-300 rounded-md bg-white">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-700">Pricing</h3>
        </div>
        <div className="p-5 md:p-6">
        {isEditing ? (
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Base Price</label>
              <input
                type="number"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                className="text-xl font-medium text-gray-900 border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:border-indigo-300"
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Offer Price (optional)</label>
              <input
                type="number"
                value={formData.offerPrice}
                onChange={(e) => setFormData({ ...formData, offerPrice: parseFloat(e.target.value) || 0 })}
                className="text-xl font-medium text-gray-900 border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:border-indigo-300"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 p-4 rounded-md border border-gray-300 bg-white">
            <div className="text-2xl font-semibold text-gray-900">
              ${formData.offerPrice || formData.basePrice || 0}
            </div>
            {formData.offerPrice && formData.offerPrice > 0 && (
              <>
                <div className="text-lg text-gray-400 line-through">
                  ${formData.basePrice || 0}
                </div>
                <div className="text-xs text-gray-700 font-semibold bg-gray-100 px-2 py-1 rounded-md border border-gray-300">
                  Save ${((formData.basePrice || 0) - (formData.offerPrice || 0)).toFixed(2)}
                </div>
              </>
            )}
          </div>
        )}
        </div>
      </div>

      {/* Variants Management Section */}
      <div className="mb-2 border border-slate-300 rounded-md bg-white">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-700">Variants</h3>
        </div>
        <div className="p-5 md:p-6">
        {saveStatus === 'success' && (
          <div className="mb-4 p-3 bg-white border border-green-300 text-green-700 rounded-md text-sm">
            ✓ Variants saved successfully!
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="mb-4 p-3 bg-white border border-red-300 text-red-700 rounded-md text-sm">
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

    </div>
  );
};

export default InventoryProductDetails;
