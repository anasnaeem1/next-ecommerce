import { Inngest } from "inngest";
import { connectDb } from "./db";
import User from "../models/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "urban-next" });

// Inngest function to create user data to a database
export const syncUserCreation = inngest.createFunction(
  {
    id: "syncUserFromCLerk",
  },
  {
    event: "clerk/user.created",
  },
  async ({ event }) => {
    const { id, first_name, last_name, image_url, email_addresses } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    };
    await connectDb();
    await User.create(userData).catch((err) => {
      console.log("Error creating user:", err);
    });
  }
);

// Inngest function to update user data to a database

export const syncUserUpdation = inngest.createFunction(
  {
    id: "updateUserFromCLerk",
  },
  {
    event: "clerk/user.updated",
  },
  async ({ event }) => {
    const { id, first_name, last_name, image_url, email_addresses } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    };
    await connectDb();
    await User.findByIdAndUpdate(id, userData);
  }
);

// Inngest function to delete user data from a database
export const syncUserDeletion = inngest.createFunction(
  {
    id: "deleteUserFromClerk",
  },
  {
    event: "clerk/user.deleted",
  },
  async ({ event }) => {
    const { id, first_name, last_name, image_url, email_addresses } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    };
    await connectDb();
    await User.findByIdAndDelete(id, userData);
  }
);
// hello