import express from "express";
import { addAComment } from "../controllers/comment.controller.js";
import { protect } from "../middlewares/authMidlleware.js";

const router = express.Router();

router.post("/:blogId", protect, addAComment);

export default router;
