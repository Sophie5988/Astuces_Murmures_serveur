import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true, minLength: 10, maxLength: 200 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    blog: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
