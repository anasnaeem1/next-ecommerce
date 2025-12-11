"use client";
import React, { useState, useEffect } from "react";
import { useCategory } from "../../context/CategoryContext";

type CategorySelectorProps = {
  onCategoryChange: (category: string) => void;
};

const CategorySelector = ({ onCategoryChange }: CategorySelectorProps) => {
  const { categories, loading, error, addParentCategory, addChildCategory } = useCategory();
  const [selectedParent, setSelectedParent] = useState<string>("");
  const [selectedChild, setSelectedChild] = useState<string>("");
  const [showAddParent, setShowAddParent] = useState(false);
  const [showAddChild, setShowAddChild] = useState(false);
  const [newParentName, setNewParentName] = useState("");
  const [newChildName, setNewChildName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Update category output when selection changes
  useEffect(() => {
    if (selectedParent && selectedChild) {
      onCategoryChange(`${selectedParent}?${selectedChild}`);
    } else if (selectedParent) {
      onCategoryChange(selectedParent);
    } else {
      onCategoryChange("");
    }
  }, [selectedParent, selectedChild, onCategoryChange]);

  const handleAddParent = async () => {
    if (!newParentName.trim()) return;
    
    setIsAdding(true);
    const success = await addParentCategory(newParentName.trim());
    
    if (success) {
      const parentKey = newParentName.trim().toLowerCase();
      setSelectedParent(parentKey);
      setNewParentName("");
      setShowAddParent(false);
    }
    setIsAdding(false);
  };

  const handleAddChild = async () => {
    if (!newChildName.trim() || !selectedParent) return;
    
    setIsAdding(true);
    const success = await addChildCategory(selectedParent, newChildName.trim());
    
    if (success) {
      const childKey = newChildName.trim().toLowerCase();
      setSelectedChild(childKey);
      setNewChildName("");
      setShowAddChild(false);
    }
    setIsAdding(false);
  };

  const handleParentChange = (parent: string) => {
    setSelectedParent(parent);
    setSelectedChild(""); // Reset child when parent changes
  };

  const parentOptions = Object.keys(categories);
  const childOptions = selectedParent && categories[selectedParent] 
    ? Object.keys(categories[selectedParent].category) 
    : [];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-500">Loading categories...</div>
      </div>
    );
  }

  if (error && Object.keys(categories).length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-red-500">Error loading categories: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
          {error}
        </div>
      )}
      {/* Parent Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Parent Category
        </label>
        <div className="flex gap-2">
          <select
            value={selectedParent}
            onChange={(e) => handleParentChange(e.target.value)}
            className="flex-1 py-2 px-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-500 transition"
          >
            <option value="">Select parent category</option>
            {parentOptions.map((parentKey) => (
              <option key={parentKey} value={parentKey}>
                {categories[parentKey]?.label || parentKey}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowAddParent(!showAddParent)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            {showAddParent ? "Cancel" : "+ Add"}
          </button>
        </div>
        {showAddParent && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={newParentName}
              onChange={(e) => setNewParentName(e.target.value)}
              placeholder="Enter new parent category"
              className="flex-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-500 transition"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddParent();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddParent}
              disabled={isAdding}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? "Adding..." : "Add"}
            </button>
          </div>
        )}
      </div>

      {/* Child Category */}
      {selectedParent && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Child Category (Optional)
          </label>
          <div className="flex gap-2">
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="flex-1 py-2 px-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-500 transition"
            >
              <option value="">None (use parent only)</option>
              {childOptions.map((childKey) => (
                <option key={childKey} value={childKey}>
                  {categories[selectedParent]?.category[childKey]?.label || childKey}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowAddChild(!showAddChild)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              {showAddChild ? "Cancel" : "+ Add"}
            </button>
          </div>
          {showAddChild && (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newChildName}
                onChange={(e) => setNewChildName(e.target.value)}
                placeholder="Enter new child category"
                className="flex-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-500 transition"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddChild();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddChild}
                disabled={isAdding}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAdding ? "Adding..." : "Add"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Display Selected Category */}
      {selectedParent && (
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <span className="font-medium">Selected: </span>
          {categories[selectedParent]?.label || selectedParent}
          {selectedChild && (
            <span> → {categories[selectedParent]?.category[selectedChild]?.label || selectedChild}</span>
          )}
          <span className="ml-2 text-gray-400">
            ({selectedParent}
            {selectedChild ? `?${selectedChild}` : ""})
          </span>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;

