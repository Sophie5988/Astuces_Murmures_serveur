import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: null }, // ✅ URL de l'avatar (Supabase)
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
