'use client';
import { VariantProvider, useVariantContext } from '@/context/VariantContext';

interface VariantsTableProps {
  isSaving: boolean;
  saveStatus: 'idle' | 'success' | 'error';
  productId: any;
  initialVariants?: any[];
  onVariantsChange?: (variants: any[]) => Promise<any> | void;
  onTotalStockChange?: (totalStock: number) => void;
}

const VariantsTableContent = ({
  isSaving,
  saveStatus,
  onVariantsChange,
}: Omit<VariantsTableProps, 'initialVariants' | 'onTotalStockChange' | 'productId'>) => {
  const {
    variants,
    hasUnsavedChanges,
    validationError,
    totalStock,
    showAddVariant,
    openDropdown,
    showAddSize,
    editingQuantity,
    editingSize,
    editingColor,
    newVariantColor,
    newSize,
    editQuantityValue,
    editSizeValue,
    editColorValue,
    editColorCodeValue,
    variantInputRef,
    sizeInputRef,
    quantityInputRef,
    sizeNameInputRef,
    colorNameInputRef,
    setShowAddVariant,
    setOpenDropdown,
    setShowAddSize,
    setNewVariantColor,
    setNewSize,
    setEditingQuantity,
    setEditingSize,
    setEditingColor,
    setEditQuantityValue,
    setEditSizeValue,
    setEditColorValue,
    setEditColorCodeValue,
    addVariant,
    removeVariant,
    updateColor,
    addSize,
    removeSize,
    updateQuantity,
    updateSizeName,
    updateSizeDefault,
    handleSubmit,
  } = useVariantContext();


  return (
    <form onSubmit={(e) => handleSubmit(e, onVariantsChange)} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Validation Error Message */}
      {validationError && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {validationError}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">Product Variants</h3>
            {hasUnsavedChanges && (
              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full font-medium">
                Unsaved changes
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <button
                type="submit"
                disabled={isSaving}
                className={`${
                  isSaving
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200`}
              >
                {isSaving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowAddVariant(true)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Variant
            </button>
          </div>
        </div>
      </div>

      {/* Add Variant Form */}
      {showAddVariant && (
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-4">
            <input
              required
              ref={variantInputRef}
              type="text"
              placeholder="Enter color name (e.g., Black, White, Navy)"
              value={newVariantColor}
              onChange={(e) => setNewVariantColor(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && addVariant(newVariantColor)}
            />
            <button
              type="button"
              onClick={() => addVariant(newVariantColor)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddVariant(false);
                setNewVariantColor('');
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Variants List */}
      <div className="divide-y divide-gray-200">
        {variants.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            <div className="flex flex-col items-center gap-2">
              <svg
                className="w-12 h-12 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <p>No variants added yet</p>
              <p className="text-sm">Click "Add Variant" to get started</p>
            </div>
          </div>
        ) : (
          variants.map((variant, variantIndex) => (
            <div
              key={variantIndex}
              className={`border-b border-gray-200 transition-all duration-200 ${
                openDropdown === variantIndex ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
              }`}
            >
              {/* Variant Header */}
              <div
                className="px-6 py-4 cursor-pointer"
                onClick={() => setOpenDropdown(openDropdown === variantIndex ? null : variantIndex)}
              >
                <div className="flex items-center justify-between">
                  {/* Color Section */}
                  <div className="flex items-center gap-3 flex-1">
                    {editingColor === variantIndex ? (
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                          <input
                            type="color"
                            value={editColorCodeValue || variant.colorCode || '#e5e7eb'}
                            onChange={(e) => setEditColorCodeValue(e.target.value)}
                            className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer"
                            style={{ 
                              backgroundColor: editColorCodeValue || variant.colorCode || '#e5e7eb',
                              WebkitAppearance: 'none',
                              appearance: 'none',
                            }}
                            title="Pick a color"
                          />
                        </div>
                        <input
                          ref={colorNameInputRef}
                          type="text"
                          value={editColorValue}
                          onChange={(e) => setEditColorValue(e.target.value)}
                          className="px-2 py-1 text-sm border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onClick={(e) => e.stopPropagation()}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              updateColor(variantIndex, editColorValue, editColorCodeValue);
                            }
                            if (e.key === 'Escape') {
                              setEditingColor(null);
                              setEditColorValue('');
                              setEditColorCodeValue('');
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateColor(variantIndex, editColorValue, editColorCodeValue);
                          }}
                          className="px-2 py-1 text-xs text-blue-600 hover:text-blue-700 font-medium bg-blue-50 rounded hover:bg-blue-100"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingColor(null);
                            setEditColorValue('');
                            setEditColorCodeValue('');
                          }}
                          className="px-2 py-1 text-xs text-gray-600 hover:text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full border-2 border-gray-300 flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-gray-400 transition-all"
                          style={{ backgroundColor: variant.colorCode || '#e5e7eb' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingColor(variantIndex);
                            setEditColorValue(variant.color);
                            setEditColorCodeValue(variant.colorCode || '#e5e7eb');
                          }}
                          title="Click to edit color"
                        ></div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-medium text-gray-900">{variant.color}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingColor(variantIndex);
                              setEditColorValue(variant.color);
                              setEditColorCodeValue(variant.colorCode || '#e5e7eb');
                            }}
                            className="text-xs text-blue-600 hover:text-blue-700"
                          >
                            Edit
                          </button>
                        </div>
                        <span className="text-sm text-gray-500">
                          ({variant.sizes.length} size{variant.sizes.length !== 1 ? 's' : ''})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        openDropdown === variantIndex ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeVariant(variantIndex);
                      }}
                      className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Expandable Sizes Section */}
              {openDropdown === variantIndex && (
                <div className="px-6 pb-4 border-t border-gray-200 bg-white">
                  <div className="pt-4">
                    {/* Sizes List */}
                    {variant.sizes.length === 0 ? (
                      <div className="text-center py-6 text-gray-400">
                        <p className="text-sm">No sizes added yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3 mb-4">
                        {variant.sizes.map((size, sizeIndex) => (
                          <div
                            key={sizeIndex}
                            className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            {/* Size Name */}
                            <div className="flex-1">
                              {editingSize?.variantIndex === variantIndex &&
                              editingSize?.sizeIndex === sizeIndex ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    ref={sizeNameInputRef}
                                    type="text"
                                    value={editSizeValue}
                                    onChange={(e) => setEditSizeValue(e.target.value)}
                                    className="flex-1 px-3 py-2 text-sm border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        updateSizeName(variantIndex, sizeIndex, editSizeValue);
                                      }
                                      if (e.key === 'Escape') {
                                        setEditingSize(null);
                                        setEditSizeValue('');
                                      }
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateSizeName(variantIndex, sizeIndex, editSizeValue)
                                    }
                                    className="px-3 py-1 text-xs text-blue-600 hover:text-blue-700 font-medium bg-blue-50 rounded hover:bg-blue-100"
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingSize(null);
                                      setEditSizeValue('');
                                    }}
                                    className="px-3 py-1 text-xs text-gray-600 hover:text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-900">
                                    {size.size}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingSize({
                                        variantIndex,
                                        sizeIndex,
                                      });
                                      setEditSizeValue(size.size);
                                    }}
                                    className="text-xs text-blue-600 hover:text-blue-700"
                                  >
                                    Edit
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Quantity */}
                            <div className="w-28">
                              {editingQuantity?.variantIndex === variantIndex &&
                              editingQuantity?.sizeIndex === sizeIndex ? (
                                <input
                                  ref={quantityInputRef}
                                  type="number"
                                  value={editQuantityValue}
                                  onChange={(e) =>
                                    setEditQuantityValue(parseInt(e.target.value) || 0)
                                  }
                                  className="w-full px-3 py-2 text-sm border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center font-medium"
                                  min="0"
                                  onBlur={() => {
                                    updateQuantity(variantIndex, sizeIndex, editQuantityValue);
                                  }}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      updateQuantity(variantIndex, sizeIndex, editQuantityValue);
                                    }
                                    if (e.key === 'Escape') {
                                      setEditingQuantity(null);
                                      setEditQuantityValue(size.stock);
                                    }
                                  }}
                                />
                              ) : (
                                <input
                                  type="number"
                                  value={size.stock}
                                  readOnly
                                  onClick={() => {
                                    setEditingQuantity({
                                      variantIndex,
                                      sizeIndex,
                                    });
                                    setEditQuantityValue(size.stock);
                                  }}
                                  className="w-full px-3 py-2 text-sm border border-transparent bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-colors text-center font-medium text-gray-900"
                                  onFocus={(e) => e.target.blur()}
                                />
                              )}
                            </div>

                            {/* Set as Default Switch */}
                            <div className="flex items-center gap-2">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <span className="text-xs text-gray-600">Default</span>
                                <div className="relative">
                                  <input
                                    type="checkbox"
                                    checked={size.isDefault || false}
                                    onChange={(e) => {
                                      updateSizeDefault(variantIndex, sizeIndex, e.target.checked);
                                    }}
                                    className="sr-only"
                                  />
                                  <div
                                    className={`w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                                      size.isDefault || false
                                        ? 'bg-blue-600'
                                        : 'bg-gray-300'
                                    }`}
                                  >
                                    <div
                                      className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-0.5 ${
                                        size.isDefault || false
                                          ? 'translate-x-5'
                                          : 'translate-x-0.5'
                                      }`}
                                    />
                                  </div>
                                </div>
                              </label>
                            </div>

                            {/* Delete Size Button */}
                            <button
                              type="button"
                              onClick={() => removeSize(variantIndex, sizeIndex)}
                              className="text-red-500 hover:text-red-700 transition-colors p-1"
                              title="Delete size"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Size Button */}
                    {showAddSize === variantIndex ? (
                      <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <input
                          required
                          ref={sizeInputRef}
                          type="text"
                          placeholder="Size (e.g., S, M, L, XL)"
                          value={newSize.size}
                          onChange={(e) => setNewSize({ ...newSize, size: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          onKeyPress={(e) =>
                            e.key === 'Enter' && addSize(variantIndex, newSize.size, newSize.stock)
                          }
                        />
                        <input
                          required
                          type="number"
                          placeholder="Quantity"
                          value={newSize.stock}
                          onChange={(e) =>
                            setNewSize({ ...newSize, stock: parseInt(e.target.value) || 0 })
                          }
                          min="0"
                          className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          onKeyPress={(e) =>
                            e.key === 'Enter' && addSize(variantIndex, newSize.size, newSize.stock)
                          }
                        />
                        <button
                          type="button"
                          onClick={() => addSize(variantIndex, newSize.size, newSize.stock)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddSize(null);
                            setNewSize({ size: '', stock: 0 });
                          }}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowAddSize(variantIndex)}
                        className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Add Size
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Total Stock Summary */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h4 className="text-sm font-medium text-gray-700">Total Stock:</h4>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-gray-900">
                {totalStock}
              </span>
              <span className="text-sm text-gray-500">units</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{variants.length} variant{variants.length !== 1 ? 's' : ''}</span>
            <span>•</span>
            <span>
              {variants.reduce((total, variant) => total + variant.sizes.length, 0)} size
              {variants.reduce((total, variant) => total + variant.sizes.length, 0) !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </form>
  );
};

const VariantsTable = ({
  isSaving,
  saveStatus,
  productId,
  initialVariants = [],
  onVariantsChange,
  onTotalStockChange,
}: VariantsTableProps) => {
  return (
    <VariantProvider initialVariants={initialVariants} onTotalStockChange={onTotalStockChange}>
      <VariantsTableContent
        isSaving={isSaving}
        saveStatus={saveStatus}
        onVariantsChange={onVariantsChange}
      />
    </VariantProvider>
  );
};

export default VariantsTable;
