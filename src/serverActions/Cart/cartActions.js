"use server";
import { useContext } from "react";
import { connectDb } from "../../../config/db.js";
import Cart from "../../../models/Cart.js";
import Product from "../../../models/Product.js";
import mongoose from "mongoose";

async function getCartModel() {
  await connectDb();
  return Cart;
}

async function getProductModel() {
  await connectDb();
  return Product;
}

export const addToCart = async (formData) => {
  try {
    // Get form data
    const userId = formData.get("userId");
    const Cart = await getCartModel();
    const Product = await getProductModel();
    const productId = formData.get("productId");
    const quantity = Number(formData.get("quantity")) || 1;
    const variant = formData.get("variant");
    const size = formData.get("size");
    const color = formData.get("color");

    // Validate form data
    if (!userId) {
      return { success: false, message: "User ID is required" };
    }

    if (!productId) {
      return { success: false, message: "Product ID is required" };
    }

    if (!size) {
      return { success: false, message: "Size is required" };
    }

    if (!color) {
      return { success: false, message: "Color is required" };
    }

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return { success: false, message: "Product not found" };
    }

    // Calculate item price and total
    const itemPrice = Number(product.offerPrice) || Number(product.price) || 0;
    if (!itemPrice || isNaN(itemPrice)) {
      return { success: false, message: "Product price is invalid" };
    }
    const itemTotal = Number((itemPrice * quantity).toFixed(2));
    if (isNaN(itemTotal)) {
      return { success: false, message: "Failed to calculate item total" };
    }

    const productObjectId = new mongoose.Types.ObjectId(productId);

    let cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      const cartItem = {
        productId: productObjectId,
        quantity,
        price: itemTotal,
        variant: variant || "",
        size,
        color,
      };
      const newCart = new Cart({
        userId: userId,
        items: [cartItem],
        totalPrice: Number(itemTotal.toFixed(2)),
      });
      cart = await newCart.save();
      console.log("✅ New cart created:", cart._id);
    } else {
      const existingItemIndex = cart.items.findIndex(
        (item) =>
          item.productId.toString() === productId &&
          item.color === color &&
          item.size === size
      );

      if (existingItemIndex !== -1) {
        const existingItem = cart.items[existingItemIndex];
        existingItem.quantity += quantity;
        existingItem.price = Number((itemPrice * existingItem.quantity).toFixed(2));
        console.log("✅ Item quantity updated:", existingItem.quantity);
      } else {
        const cartItem = {
          productId: productObjectId,
          quantity,
          price: itemTotal,
          variant: variant || "",
          size,
          color,
        };
        cart.items.push(cartItem);
        console.log("✅ New item added to cart");
      }

      let newTotal = 0;
      for (const item of cart.items) {
        let itemPrice = item.price;
        if (!itemPrice || isNaN(itemPrice)) {
          const prod = await Product.findById(item.productId);
          if (prod) {
            const prodPrice = Number(prod.offerPrice) || Number(prod.price) || 0;
            itemPrice = prodPrice * item.quantity;
            item.price = itemPrice;
          } else {
            itemPrice = 0;
          }
        }
        newTotal += Number(itemPrice) || 0;
      }
      cart.totalPrice = Number(newTotal.toFixed(2));

      await cart.save();
      console.log("✅ Cart updated:", cart._id);
    }

    const cartData = {
      _id: cart._id.toString(),
      userId: cart.userId.toString(),
      items: cart.items.map((item) => ({
        productId: item.productId.toString(),
        quantity: Number(item.quantity) || 1,
        price: Number(item.price) || 0, // Ensure price is a number
        variant: item.variant?.toString() || "",
        size: String(item.size || ""),
        color: String(item.color || ""),
      })),
      totalPrice: Number(cart.totalPrice) || 0,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };

    console.log("📦 Cart data being sent to frontend:", JSON.stringify(cartData, null, 2));
    console.log("💰 Item prices:", cartData.items.map(i => ({ price: i.price, quantity: i.quantity })));

    return { success: true, message: "Product added to cart", cart: cartData };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false, message: error.message };
  }
};

export const getCart = async (userId) => {
  try {
    if (!userId) {
      return { success: false, message: "User ID is required" };
    }

    const Cart = await getCartModel();
    const Product = await getProductModel();

    // Get cart for user
    const cart = await Cart.findOne({ userId: userId }).lean();

    if (!cart || !cart.items || cart.items.length === 0) {
      return {
        success: true,
        cart: {
          _id: "",
          userId: String(userId),
          items: [],
          totalPrice: 0,
          createdAt: null,
          updatedAt: null,
        },
      };
    }

    // Fetch product details for each item and serialize properly
    const itemsWithProducts = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId).lean();
        
        // Serialize item completely
        const serializedItem = {
          productId: item.productId ? String(item.productId) : "",
          quantity: Number(item.quantity),
          price: Number(item.price),
          variant: item.variant ? String(item.variant) : "",
          size: String(item.size || ""),
          color: String(item.color || ""),
          product: product
            ? {
                _id: product._id ? String(product._id) : "",
                productTitle: String(product.productTitle || product.title || "Unknown Product"),
                images: Array.isArray(product.images) ? product.images.map(img => String(img)) : [],
                slug: String(product.uniqueId || product.slug || ""),
              }
            : null,
        };
        
        // Return plain object (no MongoDB types)
        return JSON.parse(JSON.stringify(serializedItem));
      })
    );

    // Serialize cart data to plain objects (no MongoDB ObjectIds or Date objects)
    const cartData = {
      _id: cart._id ? String(cart._id) : "",
      userId: String(cart.userId),
      items: itemsWithProducts,
      totalPrice: Number(cart.totalPrice || 0),
      createdAt: cart.createdAt ? new Date(cart.createdAt).toISOString() : null,
      updatedAt: cart.updatedAt ? new Date(cart.updatedAt).toISOString() : null,
    };

    // Stringify and parse to ensure all nested objects are plain
    const serializedCart = JSON.parse(JSON.stringify(cartData));

    return { success: true, cart: serializedCart };
  } catch (error) {
    console.error("Error getting cart:", error);
    return { success: false, message: error.message };
  }
};

export const removeCartItem = async (userId, itemIndex) => {
  try {
    if (!userId) {
      return { success: false, message: "User ID is required" };
    }

    if (itemIndex === undefined || itemIndex === null) {
      return { success: false, message: "Item index is required" };
    }

    const Cart = await getCartModel();
    const Product = await getProductModel();

    // Get cart for user
    const cart = await Cart.findOne({ userId: userId });

    if (!cart || !cart.items || cart.items.length === 0) {
      return { success: false, message: "Cart not found or empty" };
    }

    if (itemIndex < 0 || itemIndex >= cart.items.length) {
      return { success: false, message: "Invalid item index" };
    }

    // Remove item at the specified index
    cart.items.splice(itemIndex, 1);

    // Recalculate total price from remaining items
    let newTotal = 0;
    for (const item of cart.items) {
      let itemPrice = item.price;
      if (!itemPrice || isNaN(itemPrice)) {
        // Fallback: fetch product and calculate price
        const prod = await Product.findById(item.productId);
        if (prod) {
          const prodPrice = Number(prod.offerPrice) || Number(prod.price) || 0;
          itemPrice = prodPrice * item.quantity;
          item.price = itemPrice;
        } else {
          itemPrice = 0;
        }
      }
      newTotal += Number(itemPrice) || 0;
    }
    cart.totalPrice = Number(newTotal.toFixed(2));

    await cart.save();
    console.log("✅ Cart item removed:", itemIndex);

    // Serialize cart data
    const itemsWithProducts = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId).lean();
        
        const serializedItem = {
          productId: item.productId ? String(item.productId) : "",
          quantity: Number(item.quantity),
          price: Number(item.price),
          variant: item.variant ? String(item.variant) : "",
          size: String(item.size || ""),
          color: String(item.color || ""),
          product: product
            ? {
                _id: product._id ? String(product._id) : "",
                productTitle: String(product.productTitle || product.title || "Unknown Product"),
                images: Array.isArray(product.images) ? product.images.map(img => String(img)) : [],
                slug: String(product.uniqueId || product.slug || ""),
              }
            : null,
        };
        
        return JSON.parse(JSON.stringify(serializedItem));
      })
    );

    const cartData = {
      _id: cart._id ? String(cart._id) : "",
      userId: String(cart.userId),
      items: itemsWithProducts,
      totalPrice: Number(cart.totalPrice || 0),
      createdAt: cart.createdAt ? new Date(cart.createdAt).toISOString() : null,
      updatedAt: cart.updatedAt ? new Date(cart.updatedAt).toISOString() : null,
    };

    const serializedCart = JSON.parse(JSON.stringify(cartData));

    return { success: true, message: "Item removed from cart", cart: serializedCart };
  } catch (error) {
    console.error("Error removing cart item:", error);
    return { success: false, message: error.message };
  }
};

export const updateCartItem = async (userId, itemIndex, updates) => {
  try {
    if (!userId) {
      return { success: false, message: "User ID is required" };
    }

    if (itemIndex === undefined || itemIndex === null) {
      return { success: false, message: "Item index is required" };
    }

    if (!updates || Object.keys(updates).length === 0) {
      return { success: false, message: "Updates are required" };
    }

    const Cart = await getCartModel();
    const Product = await getProductModel();

    // Get cart for user
    const cart = await Cart.findOne({ userId: userId });

    if (!cart || !cart.items || cart.items.length === 0) {
      return { success: false, message: "Cart not found or empty" };
    }

    if (itemIndex < 0 || itemIndex >= cart.items.length) {
      return { success: false, message: "Invalid item index" };
    }

    const item = cart.items[itemIndex];

    // Update item fields
    if (updates.quantity !== undefined) {
      const newQuantity = Number(updates.quantity);
      if (newQuantity < 1) {
        return { success: false, message: "Quantity must be at least 1" };
      }
      
      // Save old quantity and price before updating
      const oldQuantity = item.quantity || 1;
      const oldPrice = item.price || 0;
      
      // Update quantity
      item.quantity = newQuantity;
      
      // Recalculate item price based on new quantity
      // Get unit price from product
      const product = await Product.findById(item.productId);
      if (product) {
        const unitPrice = Number(product.offerPrice) || Number(product.price) || 0;
        item.price = Number((unitPrice * newQuantity).toFixed(2));
      } else {
        // If product not found, try to calculate from existing price
        const unitPrice = oldQuantity > 0 ? oldPrice / oldQuantity : 0;
        item.price = Number((unitPrice * newQuantity).toFixed(2));
      }
    }

    if (updates.size !== undefined) {
      item.size = String(updates.size);
    }

    if (updates.color !== undefined) {
      item.color = String(updates.color);
    }

    if (updates.variant !== undefined) {
      item.variant = String(updates.variant);
    }

    // Recalculate total price from all items
    let newTotal = 0;
    for (const cartItem of cart.items) {
      let itemPrice = cartItem.price;
      if (!itemPrice || isNaN(itemPrice)) {
        // Fallback: fetch product and calculate price
        const prod = await Product.findById(cartItem.productId);
        if (prod) {
          const prodPrice = Number(prod.offerPrice) || Number(prod.price) || 0;
          itemPrice = prodPrice * cartItem.quantity;
          cartItem.price = itemPrice;
        } else {
          itemPrice = 0;
        }
      }
      newTotal += Number(itemPrice) || 0;
    }
    cart.totalPrice = Number(newTotal.toFixed(2));

    await cart.save();
    console.log("✅ Cart item updated:", itemIndex, updates);

    // Serialize cart data
    const itemsWithProducts = await Promise.all(
      cart.items.map(async (cartItem) => {
        const product = await Product.findById(cartItem.productId).lean();
        
        const serializedItem = {
          productId: cartItem.productId ? String(cartItem.productId) : "",
          quantity: Number(cartItem.quantity),
          price: Number(cartItem.price),
          variant: cartItem.variant ? String(cartItem.variant) : "",
          size: String(cartItem.size || ""),
          color: String(cartItem.color || ""),
          product: product
            ? {
                _id: product._id ? String(product._id) : "",
                productTitle: String(product.productTitle || product.title || "Unknown Product"),
                images: Array.isArray(product.images) ? product.images.map(img => String(img)) : [],
                slug: String(product.uniqueId || product.slug || ""),
              }
            : null,
        };
        
        return JSON.parse(JSON.stringify(serializedItem));
      })
    );

    const cartData = {
      _id: cart._id ? String(cart._id) : "",
      userId: String(cart.userId),
      items: itemsWithProducts,
      totalPrice: Number(cart.totalPrice || 0),
      createdAt: cart.createdAt ? new Date(cart.createdAt).toISOString() : null,
      updatedAt: cart.updatedAt ? new Date(cart.updatedAt).toISOString() : null,
    };

    const serializedCart = JSON.parse(JSON.stringify(cartData));

    return { success: true, message: "Item updated in cart", cart: serializedCart };
  } catch (error) {
    console.error("Error updating cart item:", error);
    return { success: false, message: error.message };
  }
};