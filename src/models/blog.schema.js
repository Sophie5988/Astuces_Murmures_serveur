import mongoose, { Schema } from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minLength: 3 },
    content: { type: String, required: true, minLength: 50 },
    image: { type: String, default: null },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

blogSchema.virtual("ratings", {
  ref: "Rating",
  localField: "_id",
  foreignField: "blog",
});

blogSchema.set("toJSON", { virtuals: true });
blogSchema.set("toObject", { virtuals: true });

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
