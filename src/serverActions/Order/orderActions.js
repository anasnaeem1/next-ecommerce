"use server";
import { connectDb } from "../../../config/db";
import mongoose from "mongoose";
import Order from "../../../models/Order";
import Cart from "../../../models/Cart";

async function getOrderModel() {
  await connectDb();
  return Order;
}

async function getCartModel() {
  await connectDb();
  return Cart;
}

export const createOrder = async (formData) => {
  try {
    const userId = formData.get("userId");
    const Order = await getOrderModel();
    const Cart = await getCartModel();

    if (!userId) {
      return { success: false, message: "User ID is required" };
    }

    const cart = await Cart.findOne({ userId: userId });
    if (!cart || !cart.items || cart.items.length === 0) {
      return { success: false, message: "Cart is empty" };
    }

    const shippingInfo = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state"),
      zipCode: formData.get("zipCode"),
      country: formData.get("country") || "United States",
    };

    const cardNumber = formData.get("cardNumber")?.toString().replace(/\s/g, "") || "";
    const paymentInfo = {
      cardNumber: cardNumber,
      cardName: formData.get("cardName"),
      expiryDate: formData.get("expiryDate"),
      cvv: formData.get("cvv"),
    };

    const subtotal = Number(formData.get("subtotal")) || 0;
    const shipping = Number(formData.get("shipping")) || 0;
    const tax = Number(formData.get("tax")) || 0;
    const total = Number(formData.get("total")) || 0;

    const orderItems = cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      variant: item.variant || "",
      size: item.size,
      color: item.color,
    }));

    const newOrder = new Order({
      userId: userId,
      orderItems: orderItems,
      shippingInfo: shippingInfo,
      paymentInfo: paymentInfo,
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      total: total,
      status: "pending",
    });

    const savedOrder = await newOrder.save();

    if (!savedOrder || !savedOrder._id) {
      return { success: false, message: "Failed to save order to database" };
    }

    await Cart.findOneAndUpdate(
      { userId: userId },
      { $set: { items: [], totalPrice: 0 } }
    );

    const orderData = {
      _id: savedOrder._id.toString(),
      userId: savedOrder.userId.toString(),
      orderItems: savedOrder.orderItems.map((item) => ({
        productId: item.productId.toString(),
        quantity: Number(item.quantity) || 1,
        price: Number(item.price) || 0,
        variant: item.variant?.toString() || "",
        size: String(item.size || ""),
        color: String(item.color || ""),
      })),
      shippingInfo: {
        firstName: savedOrder.shippingInfo.firstName,
        lastName: savedOrder.shippingInfo.lastName,
        email: savedOrder.shippingInfo.email,
        phone: savedOrder.shippingInfo.phone,
        address: savedOrder.shippingInfo.address,
        city: savedOrder.shippingInfo.city,
        state: savedOrder.shippingInfo.state,
        zipCode: savedOrder.shippingInfo.zipCode,
        country: savedOrder.shippingInfo.country,
      },
      paymentInfo: {
        cardNumber: savedOrder.paymentInfo.cardNumber,
        cardName: savedOrder.paymentInfo.cardName,
        expiryDate: savedOrder.paymentInfo.expiryDate,
        cvv: savedOrder.paymentInfo.cvv,
      },
      subtotal: Number(savedOrder.subtotal) || 0,
      shipping: Number(savedOrder.shipping) || 0,
      tax: Number(savedOrder.tax) || 0,
      total: Number(savedOrder.total) || 0,
      status: savedOrder.status,
      createdAt: savedOrder.createdAt,
      updatedAt: savedOrder.updatedAt,
    };

    console.log("✅ Order created:", savedOrder._id);

    return { success: true, message: "Order placed successfully", order: orderData };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, message: error.message };
  }
};

