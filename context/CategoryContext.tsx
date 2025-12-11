"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

type ChildCategory = {
  label: string;
};

type ParentCategory = {
  label: string;
  category: {
    [key: string]: ChildCategory;
  };
};

type CategoryStructure = {
  [parentKey: string]: ParentCategory;
};

interface CategoryContextType {
  categories: CategoryStructure;
  loading: boolean;
  error: string | null;
  addParentCategory: (label: string) => Promise<boolean>;
  addChildCategory: (parentKey: string, label: string) => Promise<boolean>;
  refreshCategories: () => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

interface CategoryProviderProps {
  children: ReactNode;
}

export function CategoryProvider({ children }: CategoryProviderProps) {
  const [categories, setCategories] = useState<CategoryStructure>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/api/categories");
      
      if (response.data.success) {
        setCategories(response.data.categories || {});
      } else {
        setError(response.data.message || "Failed to fetch categories");
      }
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      setError(err.message || "An error occurred while loading categories");
      setCategories({});
    } finally {
      setLoading(false);
    }
  };

  const addParentCategory = async (label: string): Promise<boolean> => {
    try {
      setError(null);
      const response = await axios.post("/api/categories", {
        type: "parent",
        label: label,
      });

      if (response.data.success) {
        setCategories(response.data.categories || {});
        return true;
      } else {
        setError(response.data.message || "Failed to add parent category");
        return false;
      }
    } catch (err: any) {
      console.error("Error adding parent category:", err);
      setError(err.response?.data?.message || err.message || "Failed to add parent category");
      return false;
    }
  };

  const addChildCategory = async (parentKey: string, label: string): Promise<boolean> => {
    try {
      setError(null);
      const response = await axios.post("/api/categories", {
        type: "child",
        parentKey: parentKey,
        label: label,
      });

      if (response.data.success) {
        setCategories(response.data.categories || {});
        return true;
      } else {
        setError(response.data.message || "Failed to add child category");
        return false;
      }
    } catch (err: any) {
      console.error("Error adding child category:", err);
      setError(err.response?.data?.message || err.message || "Failed to add child category");
      return false;
    }
  };

  const refreshCategories = async () => {
    await fetchCategories();
  };

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const value: CategoryContextType = {
    categories,
    loading,
    error,
    addParentCategory,
    addChildCategory,
    refreshCategories,
  };

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
}

export function useCategory() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
}

