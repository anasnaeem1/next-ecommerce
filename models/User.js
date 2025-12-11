import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    Cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      default: null,
    },
  },
  { minimize: false }
);

const User = mongoose.models?.User || mongoose.model("User", userSchema);

export default User;
