import express from "express";

import userRoutes from "./user.route.js";
import blogRoutes from "./blog.route.js";
import ratingRoutes from "./rating.route.js";
import commentRoutes from "./comment.route.js";

const router = express.Router();

router.use("/blog", blogRoutes);
router.use("/user", userRoutes);
router.use("/rating", ratingRoutes);
router.use("/comment", commentRoutes);

export default router;
