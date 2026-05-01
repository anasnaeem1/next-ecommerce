"use server";
import { connectDb } from "../../config/db.js";
import User from "../../models/User.js";
import Session from "../../models/Session.js";
import Cart from "../../models/Cart.js";
import { auth, currentUser } from "@clerk/nextjs/server";
import jwt from "jsonwebtoken";
import crypto from "crypto";

async function clerkUser(expectedId) {
  const { userId } = await auth();
  if (!userId) return null;
  if (expectedId && userId !== expectedId) return null;
  const u = await currentUser();
  if (!u || u.id !== userId) return null;
  return u;
}

async function saveClerkUser(c) {
  const emailObj =
    c.emailAddresses?.find((e) => e.id === c.primaryEmailAddressId) ||
    c.emailAddresses?.[0];
  const email = emailObj?.emailAddress || `${c.id}@users.clerk.dev`;

  const fullName =
    (c.fullName && String(c.fullName).trim()) ||
    [c.firstName, c.lastName].filter(Boolean).join(" ").trim() ||
    (c.username || "").trim() ||
    email.split("@")[0] ||
    "User";

  const phone =
    c.phoneNumbers?.find((p) => p.id === c.primaryPhoneNumberId)?.phoneNumber ||
    c.phoneNumbers?.[0]?.phoneNumber ||
    "";

  const birthday = c.birthday != null ? String(c.birthday) : "";

  await User.findOneAndUpdate(
    { _id: c.id },
    {
      $set: {
        name: fullName,
        fullName,
        firstName: c.firstName || "",
        lastName: c.lastName || "",
        username: c.username || "",
        email,
        imageUrl: c.imageUrl || "",
        birthday,
        phone,
      },
      $setOnInsert: { _id: c.id, role: "Customer" },
    },
    { upsert: true }
  );
}

async function validSession(session, clerkId) {
  if (!session || session.userId !== clerkId) return false;
  if (!session.isActive) return false;
  if (new Date() > session.expiresAt) {
    session.isActive = false;
    await session.save();
    return false;
  }
  return true;
}

export async function ensureSessionForUser(userId) {
  try {
    const c = await clerkUser(userId);
    if (!c) return null;
    await connectDb();
    const existing = await Session.findOne({
      userId,
      isActive: true,
      expiresAt: { $gt: new Date() },
    });
    if (existing) return existing;
    return Session.create({
      userId,
      secret: crypto.randomBytes(32).toString("hex"),
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      isActive: true,
    });
  } catch (e) {
    console.error(e);
    return null;
  }
}

export const getUser = async (sessionId) => {
  try {
    if (!sessionId) return { success: false, message: "no session id" };
    const c = await clerkUser(null);
    if (!c) return { success: false, message: "sign in" };

    await connectDb();
    const session = await Session.findById(sessionId);
    if (!(await validSession(session, c.id))) {
      return { success: false, message: "bad session" };
    }

    await saveClerkUser(c);
    const user = await User.findById(session.userId).lean();
    if (!user) return { success: false, message: "no user" };

    let cart = null;
    if (user.Cart) cart = await Cart.findById(user.Cart).lean();
    else cart = await Cart.findOne({ userId: user._id }).lean();

    return {
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        fullName: user.fullName,
        email: user.email,
        imageUrl: user.imageUrl,
        birthday: user.birthday,
        phone: user.phone,
      },
      cart: cart
        ? {
            _id: cart._id,
            userId: cart.userId,
            items: cart.items || [],
            totalPrice: cart.totalPrice || 0,
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt,
          }
        : null,
    };
  } catch (e) {
    console.error(e);
    return { success: false, message: e.message };
  }
};

export async function ensureSessionOnLogin(userId) {
  try {
    if (!userId) return { success: false, message: "no id" };
    const c = await clerkUser(userId);
    if (!c) return { success: false, message: "sign in" };

    await connectDb();
    await saveClerkUser(c);

    const session = await ensureSessionForUser(userId);
    if (!session?._id) return { success: false, message: "no session" };

    return {
      success: true,
      sessionId: String(session._id),
      secret: session.secret,
      expiresAt: session.expiresAt.toISOString(),
    };
  } catch (e) {
    console.error(e);
    return { success: false, message: e.message };
  }
}

export async function getUserBySessionId(sessionId) {
  try {
    if (!sessionId) return { success: false, message: "no session id" };
    const c = await clerkUser(null);
    if (!c) return { success: false, message: "sign in" };

    await connectDb();
    const session = await Session.findById(sessionId);
    if (!(await validSession(session, c.id))) {
      return { success: false, message: "bad session" };
    }

    await saveClerkUser(c);
    const user = await User.findById(session.userId)
    console.log("user", user);
    if (!user) return { success: false, message: "no user" };

    return {
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        fullName: user.fullName,
        role: user.role,
        email: user.email,
        imageUrl: user.imageUrl,
        birthday: user.birthday,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      },
    };
  } catch (e) {
    console.error(e);
    return { success: false, message: e.message };
  }
}

export async function validateSession(secret) {
  try {
    if (!secret) return { success: false, message: "no secret" };
    const c = await clerkUser(null);
    if (!c) return { success: false, message: "sign in" };

    await connectDb();
    const session = await Session.findOne({ secret, isActive: true });
    if (!(await validSession(session, c.id))) {
      return { success: false, message: "bad session" };
    }
    return {
      success: true,
      session: {
        _id: session._id,
        userId: session.userId,
        secret: session.secret,
        expiresAt: session.expiresAt.toISOString(),
        isActive: session.isActive,
      },
    };
  } catch (e) {
    console.error(e);
    return { success: false, message: e.message };
  }
}

const secretKey = process.env.JWT_SECRET || "project-urban-buy";

export const generateToken = async (userId) => {
  const c = await clerkUser(userId);
  if (!c) throw new Error("sign in");
  return jwt.sign({ id: userId }, secretKey, { expiresIn: "3d" });
};
