import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema(
  {
    size: {
      default: "",
      type: String,
      required:true,
      trim: true,
    },
    stock: {
      default: 0,
      type: Number,
      required: true,
      min: 0,
    },
    sku: {
      default: "",
      type: String,
      trim: true,
    },
    price: {
      default: 0,
      type: Number,
      min: 0,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const variantSchema = new mongoose.Schema(
  {
    color: {
      default: "",
      type: String,
      required: true,
      trim: true,
    },
    colorCode: {
      default: "",
      type: String, // optional hex or RGB value
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    sizes: {
      type: [sizeSchema],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "At least one size is required for each color variant.",
      },
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    uniqueId: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
      unique: true,
    },
    productTitle: {
      type: String,
      required: true,
      maxlength: 150,
      trim: true,
    },
    productDesc: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one image is required.",
      },
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    offerPrice: {
      type: Number,
      min: 0,
    },
    totalStock: {
      type: Number,
      required: true,
      min: 0,
    },
    variants: {
      type: [variantSchema],
      default: [],
      validate: {
        validator: function (variants) {
          // Ensure only one variant is marked as default
          const defaultVariants = variants.filter(v => v.isDefault === true);
          if (defaultVariants.length > 1) {
            return false;
          }
          
          // If there's a default variant, ensure it has exactly one default size
          if (defaultVariants.length === 1) {
            const defaultVariant = defaultVariants[0];
            const defaultSizes = defaultVariant.sizes.filter(s => s.isDefault === true);
            if (defaultSizes.length !== 1) {
              return false;
            }
          }
          
          // Ensure no non-default variants have default sizes
          const nonDefaultVariants = variants.filter(v => v.isDefault !== true);
          for (const variant of nonDefaultVariants) {
            const hasDefaultSize = variant.sizes.some(s => s.isDefault === true);
            if (hasDefaultSize) {
              return false;
            }
          }
          
          return true;
        },
        message: function(props) {
          const variants = props.value || [];
          const defaultVariants = variants.filter(v => v.isDefault === true);
          
          if (defaultVariants.length > 1) {
            return "Only one color variant can be marked as default.";
          }
          
          if (defaultVariants.length === 1) {
            const defaultVariant = defaultVariants[0];
            const defaultSizes = defaultVariant.sizes.filter(s => s.isDefault === true);
            if (defaultSizes.length === 0) {
              return "The default color variant must have exactly one default size.";
            }
            if (defaultSizes.length > 1) {
              return "The default color variant can only have one default size.";
            }
          }
          
          const nonDefaultVariants = variants.filter(v => v.isDefault !== true);
          for (const variant of nonDefaultVariants) {
            const hasDefaultSize = variant.sizes.some(s => s.isDefault === true);
            if (hasDefaultSize) {
              return `Non-default color variant "${variant.color}" cannot have a default size. Only the default color can have a default size.`;
            }
          }
          
          return "Invalid default configuration.";
        },
      },
    },
  },
  { timestamps: true, minimize: false }
);

// Register Product model
// Mongoose handles re-registration automatically if model already exists
const Product = mongoose.models?.Product ?? mongoose.model("Product", productSchema);

export default Product;
