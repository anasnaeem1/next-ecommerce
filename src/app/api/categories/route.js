import { NextResponse } from "next/server";
import { connectDb } from "../../../../config/db.js";
import Category from "../../../../models/Category.js";

export const dynamic = "force-dynamic";

// GET all categories
export const GET = async () => {
  try {
    await connectDb();

    let categoryDoc = await Category.findOne();

    // If no categories exist, create default structure
    if (!categoryDoc) {
      categoryDoc = new Category({
        categories: [
          {
            key: "shoes",
            label: "Shoes",
            children: [
              { key: "heel", label: "Heel" },
              { key: "sneakers", label: "Sneakers" },
              { key: "boots", label: "Boots" },
              { key: "sandals", label: "Sandals" },
            ],
          },
          {
            key: "electronics",
            label: "Electronics",
            children: [
              { key: "earphone", label: "Earphone" },
              { key: "headphone", label: "Headphone" },
              { key: "airpods", label: "AirPods" },
            ],
          },
        ],
      });
      await categoryDoc.save();
    }

    // Convert to the format expected by frontend
    const categoryStructure = {};
    categoryDoc.categories.forEach((parent) => {
      categoryStructure[parent.key] = {
        label: parent.label,
        category: {},
      };
      parent.children.forEach((child) => {
        categoryStructure[parent.key].category[child.key] = {
          label: child.label,
        };
      });
    });

    return NextResponse.json(
      {
        success: true,
        categories: categoryStructure,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories", error: error.message },
      { status: 500 }
    );
  }
};

// POST - Add new parent or child category
export const POST = async (req) => {
  try {
    await connectDb();

    const body = await req.json();
    const { type, parentKey, childKey, label } = body;

    if (!type || !label) {
      return NextResponse.json(
        { success: false, message: "Type and label are required" },
        { status: 400 }
      );
    }

    let categoryDoc = await Category.findOne();

    if (!categoryDoc) {
      categoryDoc = new Category({ categories: [] });
    }

    if (type === "parent") {
      // Add new parent category
      const key = parentKey || label.trim().toLowerCase();
      
      // Check if parent already exists
      const existingParent = categoryDoc.categories.find((cat) => cat.key === key);
      if (existingParent) {
        return NextResponse.json(
          { success: false, message: "Parent category already exists" },
          { status: 400 }
        );
      }

      categoryDoc.categories.push({
        key,
        label: label.trim(),
        children: [],
      });
    } else if (type === "child") {
      // Add new child category to existing parent
      if (!parentKey) {
        return NextResponse.json(
          { success: false, message: "Parent key is required for child category" },
          { status: 400 }
        );
      }

      const parentIndex = categoryDoc.categories.findIndex((cat) => cat.key === parentKey);
      if (parentIndex === -1) {
        return NextResponse.json(
          { success: false, message: "Parent category not found" },
          { status: 404 }
        );
      }

      const key = childKey || label.trim().toLowerCase();
      
      // Check if child already exists
      const existingChild = categoryDoc.categories[parentIndex].children.find(
        (child) => child.key === key
      );
      if (existingChild) {
        return NextResponse.json(
          { success: false, message: "Child category already exists" },
          { status: 400 }
        );
      }

      categoryDoc.categories[parentIndex].children.push({
        key,
        label: label.trim(),
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid type. Use 'parent' or 'child'" },
        { status: 400 }
      );
    }

    await categoryDoc.save();

    // Convert to frontend format
    const categoryStructure = {};
    categoryDoc.categories.forEach((parent) => {
      categoryStructure[parent.key] = {
        label: parent.label,
        category: {},
      };
      parent.children.forEach((child) => {
        categoryStructure[parent.key].category[child.key] = {
          label: child.label,
        };
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: "Category added successfully",
        categories: categoryStructure,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error adding category:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add category", error: error.message },
      { status: 500 }
    );
  }
};

