import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Clerk userId / User._id
      required: true,
      index: true,
    },
    secret: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Session =
  mongoose.models?.Session || mongoose.model("Session", sessionSchema);

export default Session;


