// src/routes/index.js
import express from "express";
import userRoutes from "./user.route.js";
import blogRoutes from "./blog.route.js";
import ratingRoutes from "./rating.route.js"; // ⭐ nouvelle route

const router = express.Router();

// Routes principales
router.use("/user", userRoutes);
router.use("/blog", blogRoutes);
router.use("/rating", ratingRoutes); // ⭐ branchement des notes

export default router;
