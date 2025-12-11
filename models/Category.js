import mongoose from "mongoose";

const childCategorySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const parentCategorySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    children: {
      type: [childCategorySchema],
      default: [],
    },
  },
  { _id: false }
);

const categorySchema = new mongoose.Schema(
  {
    categories: {
      type: [parentCategorySchema],
      default: [],
    },
  },
  { timestamps: true }
);

// Register Category model
const Category = mongoose.models?.Category ?? mongoose.model("Category", categorySchema);

export default Category;

