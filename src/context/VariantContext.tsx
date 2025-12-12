'use client';
import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

export interface Size {
  size: string;
  stock: number;
  isDefault?: boolean;
}

export interface Variant {
  color: string;
  colorCode?: string;
  sizes: Size[];
  isDefault?: boolean;
}

interface VariantContextType {
  // State
  variants: Variant[];
  hasUnsavedChanges: boolean;
  validationError: string | null;
  totalStock: number;
  
  // UI State
  showAddVariant: boolean;
  openDropdown: number | null;
  showAddSize: number | null;
  editingQuantity: { variantIndex: number; sizeIndex: number } | null;
  editingSize: { variantIndex: number; sizeIndex: number } | null;
  editingColor: number | null;
  
  // Form Values
  newVariantColor: string;
  newSize: { size: string; stock: number };
  editQuantityValue: number;
  editSizeValue: string;
  editColorValue: string;
  editColorCodeValue: string;
  
  // Refs
  variantInputRef: React.RefObject<HTMLInputElement | null>;
  sizeInputRef: React.RefObject<HTMLInputElement | null>;
  quantityInputRef: React.RefObject<HTMLInputElement | null>;
  sizeNameInputRef: React.RefObject<HTMLInputElement | null>;
  colorNameInputRef: React.RefObject<HTMLInputElement | null>;
  
  // Actions
  setShowAddVariant: (show: boolean) => void;
  setOpenDropdown: (index: number | null) => void;
  setShowAddSize: (index: number | null) => void;
  setNewVariantColor: (color: string) => void;
  setNewSize: (size: { size: string; stock: number }) => void;
  setEditingQuantity: (state: { variantIndex: number; sizeIndex: number } | null) => void;
  setEditingSize: (state: { variantIndex: number; sizeIndex: number } | null) => void;
  setEditingColor: (index: number | null) => void;
  setEditQuantityValue: (value: number) => void;
  setEditSizeValue: (value: string) => void;
  setEditColorValue: (value: string) => void;
  setEditColorCodeValue: (value: string) => void;
  
  // Variant Operations
  addVariant: (color: string) => void;
  removeVariant: (index: number) => void;
  updateColor: (variantIndex: number, newColor: string, newColorCode: string) => void;
  
  // Size Operations
  addSize: (variantIndex: number, size: string, stock: number) => void;
  removeSize: (variantIndex: number, sizeIndex: number) => void;
  updateQuantity: (variantIndex: number, sizeIndex: number, newQuantity: number) => void;
  updateSizeName: (variantIndex: number, sizeIndex: number, newSizeName: string) => void;
  updateSizeDefault: (variantIndex: number, sizeIndex: number, isDefault: boolean) => void;
  
  // Validation & Submit
  validateVariants: () => string | null;
  handleSubmit: (e: React.FormEvent, onVariantsChange?: (variants: Variant[]) => Promise<any> | void) => Promise<void>;
}

const VariantContext = createContext<VariantContextType | undefined>(undefined);

interface VariantProviderProps {
  children: ReactNode;
  initialVariants?: Variant[];
  onTotalStockChange?: (totalStock: number) => void;
}

export const VariantProvider = ({ children, initialVariants = [], onTotalStockChange }: VariantProviderProps) => {
  const [variants, setVariants] = useState<Variant[]>(initialVariants);
  const [showAddVariant, setShowAddVariant] = useState(false);
  const [newVariantColor, setNewVariantColor] = useState('');
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [showAddSize, setShowAddSize] = useState<number | null>(null);
  const [newSize, setNewSize] = useState({ size: '', stock: 0 });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalVariants, setOriginalVariants] = useState<Variant[]>(initialVariants);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [editingQuantity, setEditingQuantity] = useState<{ variantIndex: number; sizeIndex: number } | null>(null);
  const [editingSize, setEditingSize] = useState<{ variantIndex: number; sizeIndex: number } | null>(null);
  const [editingColor, setEditingColor] = useState<number | null>(null);
  const [editQuantityValue, setEditQuantityValue] = useState<number>(0);
  const [editSizeValue, setEditSizeValue] = useState<string>('');
  const [editColorValue, setEditColorValue] = useState<string>('');
  const [editColorCodeValue, setEditColorCodeValue] = useState<string>('');
  
  const variantInputRef = useRef<HTMLInputElement>(null);
  const sizeInputRef = useRef<HTMLInputElement>(null);
  const quantityInputRef = useRef<HTMLInputElement>(null);
  const sizeNameInputRef = useRef<HTMLInputElement>(null);
  const colorNameInputRef = useRef<HTMLInputElement>(null);
  const lastSyncedInitialVariantsRef = useRef<string>(JSON.stringify(initialVariants));

  // Calculate total stock
  const calculateTotalStock = (variants: Variant[]) => {
    return variants.reduce((total, variant) => {
      return total + variant.sizes.reduce((variantTotal, size) => variantTotal + size.stock, 0);
    }, 0);
  };

  const totalStock = calculateTotalStock(variants);

  // Compare two variants arrays to detect changes
  const compareVariants = (a: Variant[], b: Variant[]) => {
    if (!a || !b) return a === b;
    if (a.length !== b.length) return false;
    return JSON.stringify(a) === JSON.stringify(b);
  };

  // Sync with parent component when variants change
  useEffect(() => {
    const hasChanges = !compareVariants(variants, originalVariants);
    setHasUnsavedChanges(hasChanges);
    onTotalStockChange?.(totalStock);
  }, [variants, originalVariants, totalStock, onTotalStockChange]);

  // Clear validation errors when variants change
  useEffect(() => {
    if (validationError) {
      setValidationError(null);
    }
  }, [variants, validationError]);

  // Update original variants when initialVariants change
  useEffect(() => {
    const currentInitialStr = JSON.stringify(initialVariants);
    if (currentInitialStr !== lastSyncedInitialVariantsRef.current) {
      const lastSynced = JSON.parse(lastSyncedInitialVariantsRef.current);
      if (!compareVariants(initialVariants, lastSynced)) {
        setVariants(initialVariants);
        setOriginalVariants(initialVariants);
        setHasUnsavedChanges(false);
        lastSyncedInitialVariantsRef.current = currentInitialStr;
      }
    }
  }, [initialVariants]);

  // Focus effects
  useEffect(() => {
    if (showAddVariant && variantInputRef.current) {
      variantInputRef.current.focus();
    }
  }, [showAddVariant]);

  useEffect(() => {
    if (showAddSize !== null && sizeInputRef.current) {
      sizeInputRef.current.focus();
    }
  }, [showAddSize]);

  useEffect(() => {
    if (editingQuantity && quantityInputRef.current) {
      quantityInputRef.current.focus();
      quantityInputRef.current.select();
    }
  }, [editingQuantity]);

  useEffect(() => {
    if (editingSize && sizeNameInputRef.current) {
      sizeNameInputRef.current.focus();
      sizeNameInputRef.current.select();
    }
  }, [editingSize]);

  useEffect(() => {
    if (editingColor !== null && colorNameInputRef.current) {
      colorNameInputRef.current.focus();
      colorNameInputRef.current.select();
    }
  }, [editingColor]);

  // Variant Operations
  const addVariant = (color: string) => {
    if (!color.trim()) return;
    const newVariant: Variant = {
      color: color.trim(),
      colorCode: '#e5e7eb',
      isDefault: false,
      sizes: [],
    };
    setVariants((prev) => [...prev, newVariant]);
    setNewVariantColor('');
    setShowAddVariant(false);
  };

  const removeVariant = (index: number) => {
    if (confirm('Are you sure you want to delete this variant?')) {
      setVariants((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateColor = (variantIndex: number, newColor: string, newColorCode: string) => {
    if (!newColor.trim()) return;
    setVariants((prev) =>
      prev.map((variant, index) =>
        index === variantIndex
          ? {
              ...variant,
              color: newColor.trim(),
              colorCode: newColorCode || variant.colorCode || '#e5e7eb',
            }
          : variant
      )
    );
    setEditingColor(null);
    setEditColorValue('');
    setEditColorCodeValue('');
  };

  // Size Operations
  const addSize = (variantIndex: number, size: string, stock: number) => {
    if (!size.trim() || stock < 0) return;
    const newSizeObj: Size = {
      size: size.trim(),
      stock: stock,
      isDefault: false,
    };
    setVariants((prev) =>
      prev.map((variant, index) =>
        index === variantIndex
          ? { ...variant, sizes: [...variant.sizes, newSizeObj] }
          : variant
      )
    );
    setNewSize({ size: '', stock: 0 });
    setShowAddSize(null);
  };

  const removeSize = (variantIndex: number, sizeIndex: number) => {
    if (confirm('Are you sure you want to delete this size?')) {
      setVariants((prev) =>
        prev.map((variant, index) =>
          index === variantIndex
            ? { ...variant, sizes: variant.sizes.filter((_, i) => i !== sizeIndex) }
            : variant
        )
      );
    }
  };

  const updateQuantity = (variantIndex: number, sizeIndex: number, newQuantity: number) => {
    if (newQuantity < 0) return;
    setVariants((prev) =>
      prev.map((variant, index) =>
        index === variantIndex
          ? {
              ...variant,
              sizes: variant.sizes.map((size, sIndex) =>
                sIndex === sizeIndex ? { ...size, stock: newQuantity } : size
              ),
            }
          : variant
      )
    );
    setEditingQuantity(null);
    setEditQuantityValue(0);
  };

  const updateSizeName = (variantIndex: number, sizeIndex: number, newSizeName: string) => {
    if (!newSizeName.trim()) return;
    setVariants((prev) =>
      prev.map((variant, index) =>
        index === variantIndex
          ? {
              ...variant,
              sizes: variant.sizes.map((size, sIndex) =>
                sIndex === sizeIndex ? { ...size, size: newSizeName.trim() } : size
              ),
            }
          : variant
      )
    );
    setEditingSize(null);
    setEditSizeValue('');
  };

  const updateSizeDefault = (variantIndex: number, sizeIndex: number, isDefault: boolean) => {
    setVariants((prev) =>
      prev.map((variant, vIndex) => {
        if (vIndex === variantIndex) {
          const updatedSizes = variant.sizes.map((size, sIndex) => ({
            ...size,
            isDefault: sIndex === sizeIndex ? isDefault : false,
          }));
          return {
            ...variant,
            isDefault: isDefault,
            sizes: updatedSizes,
          };
        }
        return {
          ...variant,
          isDefault: false,
          sizes: variant.sizes.map((size) => ({
            ...size,
            isDefault: false,
          })),
        };
      })
    );
  };

  // Validation
  const validateVariants = () => {
    const variantsWithoutSizes = variants.filter((v) => !v.sizes || v.sizes.length === 0);
    if (variantsWithoutSizes.length > 0) {
      return `${variantsWithoutSizes.length} variant(s) have no sizes. Please add at least one size to each variant before saving.`;
    }

    const sizesWithoutName = variants.some((v) =>
      v.sizes.some((s) => !s.size || s.size.trim() === '')
    );
    if (sizesWithoutName) {
      return 'Some sizes are missing a size name. Please add a size name before saving.';
    }

    const defaultVariants = variants.filter((v) => v.isDefault === true);
    if (defaultVariants.length > 1) {
      return 'Only one color variant can be marked as default.';
    }

    if (defaultVariants.length === 1) {
      const defaultVariant = defaultVariants[0];
      const defaultSizes = defaultVariant.sizes.filter((s) => s.isDefault === true);
      if (defaultSizes.length === 0) {
        return 'The default color variant must have exactly one default size.';
      }
      if (defaultSizes.length > 1) {
        return 'The default color variant can only have one default size.';
      }
    }

    const nonDefaultVariants = variants.filter((v) => v.isDefault !== true);
    for (const variant of nonDefaultVariants) {
      const hasDefaultSize = variant.sizes.some((s) => s.isDefault === true);
      if (hasDefaultSize) {
        return `Non-default color variant "${variant.color}" cannot have a default size. Only the default color can have a default size.`;
      }
    }

    return null;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent, onVariantsChange?: (variants: Variant[]) => Promise<any> | void) => {
    e.preventDefault();
    setValidationError(null);

    const error = validateVariants();
    if (error) {
      setValidationError(error);
      return;
    }

    const result = await onVariantsChange?.(variants);

    if (result !== null && result !== undefined) {
      if (Array.isArray(result)) {
        const formattedResult = result.map((v: any) => ({
          color: v.color,
          colorCode: v.colorCode || '',
          isDefault: v.isDefault || false,
          sizes: v.sizes.map((s: any) => ({
            size: s.size,
            stock: s.stock,
            isDefault: s.isDefault || false,
          })),
        }));
        setVariants(formattedResult);
        setOriginalVariants(formattedResult);
        lastSyncedInitialVariantsRef.current = JSON.stringify(formattedResult);
      } else {
        setOriginalVariants(variants);
        lastSyncedInitialVariantsRef.current = JSON.stringify(variants);
      }
      setHasUnsavedChanges(false);
    }
  };

  const value: VariantContextType = {
    // State
    variants,
    hasUnsavedChanges,
    validationError,
    totalStock,
    
    // UI State
    showAddVariant,
    openDropdown,
    showAddSize,
    editingQuantity,
    editingSize,
    editingColor,
    
    // Form Values
    newVariantColor,
    newSize,
    editQuantityValue,
    editSizeValue,
    editColorValue,
    editColorCodeValue,
    
    // Refs
    variantInputRef,
    sizeInputRef,
    quantityInputRef,
    sizeNameInputRef,
    colorNameInputRef,
    
    // Actions
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
    
    // Operations
    addVariant,
    removeVariant,
    updateColor,
    addSize,
    removeSize,
    updateQuantity,
    updateSizeName,
    updateSizeDefault,
    validateVariants,
    handleSubmit,
  };

  return <VariantContext.Provider value={value}>{children}</VariantContext.Provider>;
};

export const useVariantContext = () => {
  const context = useContext(VariantContext);
  if (context === undefined) {
    throw new Error('useVariantContext must be used within a VariantProvider');
  }
  return context;
};

