"use server";

import { connectDb } from "../../config/db.js";
import User from "../../models/User.js";
import Session from "../../models/Session.js";
import Cart from "../../models/Cart.js";
import { auth } from "@clerk/nextjs/server";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export async function ensureSessionForUser(userId) {
  try {
    if (!userId) {
      return null;
    }

    await connectDb();

    // Check if user has an active, non-expired session
    const existingSession = await Session.findOne({
      userId,
      isActive: true,
      expiresAt: { $gt: new Date() }, // Not expired
    });

    if (existingSession) {
      console.log(`✅ Active session found for user ${userId}`);
      return existingSession;
    }

    // No active session found, create a new one
    const secret = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days

    const newSession = await Session.create({
      userId,
      secret,
      expiresAt,
      isActive: true,
    });

    console.log(`✅ New session created for user ${userId}`);
    return newSession;
  } catch (error) {
    console.error("Error ensuring session for user:", error);
    return null;
  }
}

export const getUser = async (sessionId) => {
  try {
    if (!sessionId) {
      console.warn("⚠️ No sessionId provided to getUser");
      return { success: false, message: "Session ID is required" };
    }

    // Connect to database
    await connectDb();

    // 1. Get session from sessionId
    const session = await Session.findById(sessionId);

    if (!session) {
      return { success: false, message: "Session not found" };
    }

    // Check if session is active
    if (!session.isActive) {
      return { success: false, message: "Session is not active" };
    }

    // Check if session is expired
    if (new Date() > session.expiresAt) {
      // Mark session as inactive
      session.isActive = false;
      await session.save();
      return { success: false, message: "Session expired" };
    }

    // 2. Get userId from session
    const userId = session.userId;

    if (!userId) {
      return { success: false, message: "User ID not found in session" };
    }

    // 3. Get user by userId
    const user = await User.findById(userId).lean();

    if (!user) {
      return { success: false, message: "User not found" };
    }

    // 4. Get cart for the user
    let cart = null;
    if (user.Cart) {
      // If user has a Cart reference, get it
      cart = await Cart.findById(user.Cart).lean();
    } else {
      // If no Cart reference, try to find cart by userId
      cart = await Cart.findOne({ userId: userId }).lean();
    }

    // 5. Return user with cart
    return {
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
      },
      cart: cart ? {
        _id: cart._id,
        userId: cart.userId,
        items: cart.items || [],
        totalPrice: cart.totalPrice || 0,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
      } : null,
    };
  } catch (error) {
    console.error("Error getting user:", error);
    return { success: false, message: error.message };
  }
};

export async function ensureSessionOnLogin(userId) {
  try {
    if (!userId) {
      return { success: false, message: "User ID is required" };
    }

    try {
      const { userId: authenticatedUserId } = await auth();
      if (authenticatedUserId && userId !== authenticatedUserId) {
        return { success: false, message: "User ID mismatch - security violation" };
      }
    } catch (authError) {
      console.warn("⚠️ Could not verify auth server-side, trusting client userId:", authError.message);
    }

    const session = await ensureSessionForUser(userId);

    if (session) {
      const sessionIdStr = session._id ? String(session._id) : null;
      
      if (!sessionIdStr) {
        return { success: false, message: "Session ID is missing" };
      }

      console.log("✅ Session created/ensured - ID:", sessionIdStr, "Type:", typeof sessionIdStr);
      
      return { 
        success: true, 
        message: "Session ensured", 
        sessionId: sessionIdStr,
        secret: session.secret,
        expiresAt: session.expiresAt.toISOString()
      };
    }

    return { success: false, message: "Failed to create session" };
  } catch (error) {
    console.error("Error ensuring session on login:", error);
    return { success: false, message: error.message };
  }
}

export async function getUserBySessionId(sessionId) {
  try {
    if (!sessionId) {
      return { success: false, message: "Session ID is required" };
    }

    await connectDb();

    // Get session by ID
    const session = await Session.findById(sessionId);

    if (!session) {
      return { success: false, message: "Session not found" };
    }

    // Check if session is active
    if (!session.isActive) {
      return { success: false, message: "Session is not active" };
    }

    // Check if session is expired
    if (new Date() > session.expiresAt) {
      // Mark session as inactive
      session.isActive = false;
      await session.save();
      return { success: false, message: "Session expired" };
    }

    // Get user by userId from session
    const user = await User.findById(session.userId);

    if (!user) {
      return { success: false, message: "User not found" };
    }

    return {
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
      },
    };
  } catch (error) {
    console.error("Error getting user by session ID:", error);
    return { success: false, message: error.message };
  }
}

export async function validateSession(secret) {
  try {
    if (!secret) {
      return { success: false, message: "Session secret is required" };
    }

    await connectDb();

    const session = await Session.findOne({
      secret,
      isActive: true,
    });

    if (!session) {
      return { success: false, message: "Session not found" };
    }

    // Check if session is expired
    if (new Date() > session.expiresAt) {
      // Mark session as inactive
      session.isActive = false;
      await session.save();
      return { success: false, message: "Session expired" };
    }

    return { 
      success: true, 
      session: {
        _id: session._id,
        userId: session.userId,
        secret: session.secret,
        expiresAt: session.expiresAt.toISOString(),
        isActive: session.isActive
      }
    };
  } catch (error) {
    console.error("Error validating session:", error);
    return { success: false, message: error.message };
  }
}

const secretKey = process.env.JWT_SECRET || "project-urban-buy";

export const generateToken = async (userId) => {
  return jwt.sign({ id: userId }, secretKey, { expiresIn: "3d" });
};

