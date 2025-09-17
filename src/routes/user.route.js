import express from "express";
import {
  login,
  register,
  verifyMail,
  currentUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/", register);

// pour connection
router.post("/login", login);

// pour vérification e-mail
router.get("/verifyMail/:token", verifyMail);

router.get("/current", currentUser);

router.delete("/deleteToken", logoutUser);

// pour mot de passe oublié
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;

// http://localhost:5000/user
