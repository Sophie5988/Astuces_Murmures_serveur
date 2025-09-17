// ================================
// user.controller.js
// Gestion des utilisateurs : inscription, connexion,
// validation email, mot de passe oublié, réinitialisation, etc.
// ================================

import User from "../models/user.schema.js";
import TempUser from "../models/tempuser.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendConfirmationEmail } from "../email/email.js";
import { sendResetPasswordEmail } from "../email/email.js"; // 🔹 tu devras créer cette fonction
import dotenv from "dotenv";

dotenv.config();

// ================================
// Générer un token temporaire pour validation mail
// ================================
const createTokenEmail = (email) => {
  return jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "120s" });
};

// ================================
// Enregistrement utilisateur temporaire + email de confirmation
// ================================
export const register = async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;

    // Vérifier si déjà inscrit
    const existingUserMail = await User.findOne({ email });
    const existingUserPseudo = await User.findOne({ username });
    const existingTempUserMail = await TempUser.findOne({ email });
    const existingTempUserPseudo = await TempUser.findOne({ username });

    if (existingUserMail || existingUserPseudo) {
      return res.status(400).json({ message: "Déjà inscrit" });
    } else if (existingTempUserMail || existingTempUserPseudo) {
      return res.status(400).json({ message: "Vérifiez vos email" });
    }

    // Génération du token + envoi email
    const token = createTokenEmail(email);
    await sendConfirmationEmail(email, token);

    // Hash mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Sauvegarde utilisateur temporaire
    const tempUser = new TempUser({
      username,
      email,
      password: hashedPassword,
      token,
      avatar,
    });

    await tempUser.save();
    res.status(200).json({
      message:
        "Veuillez confirmer votre inscription en consultant votre boite mail",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ================================
// Connexion utilisateur
// ================================
export const login = async (req, res) => {
  const { data, password } = req.body;

  let user;
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

  // Trouver par email ou pseudo
  if (emailRegex.test(data)) {
    user = await User.findOne({ email: data });
  } else {
    user = await User.findOne({ username: data });
  }

  if (!user) {
    return res
      .status(400)
      .json({ message: "Email ou nom d'utilisateur incorrect" });
  }

  // Vérifier mot de passe
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Mot de passe incorrect" });
  }

  // Génération du token JWT
  const token = jwt.sign({}, process.env.SECRET_KEY, {
    subject: user._id.toString(),
    expiresIn: "7d",
    algorithm: "HS256",
  });

  // Stocker le token en cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ user, message: "Connexion réussie" });
};

// ================================
// Validation email (activation compte)
// ================================
export const verifyMail = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const tempUser = await TempUser.findOne({ email: decoded.email, token });

    if (!tempUser) {
      return res.redirect(
        `${
          process.env.MODE === "development"
            ? process.env.CLIENT_URL
            : process.env.DEPLOY_FRONT_URL
        }/register?message=error`
      );
    }

    // Création de l’utilisateur final
    const newUser = new User({
      username: tempUser.username,
      email: tempUser.email,
      password: tempUser.password,
      avatar: tempUser.avatar,
    });

    await newUser.save();
    await TempUser.deleteOne({ email: tempUser.email });

    res.redirect(
      `${
        process.env.MODE === "development"
          ? process.env.CLIENT_URL
          : process.env.DEPLOY_FRONT_URL
      }/register?message=success`
    );
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      return res.redirect(
        `${
          process.env.MODE === "development"
            ? process.env.CLIENT_URL
            : process.env.DEPLOY_FRONT_URL
        }/register?message=error`
      );
    }
  }
};

// ================================
// Récupération utilisateur courant
// ================================
export const currentUser = async (req, res) => {
  const { token } = req.cookies;

  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      const currentUser = await User.findById(decodedToken.sub);

      if (currentUser) {
        res.status(200).json(currentUser);
      } else {
        res.status(400).json(null);
      }
    } catch (error) {
      res.status(400).json(null);
    }
  } else {
    res.status(400).json(null);
  }
};

// ================================
// Déconnexion
// ================================
export const logoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.status(200).json({ message: "Déconnexion réussie" });
};

// ================================
// Mot de passe oublié : génération token
// ================================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Vérifier si l’email existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email non trouvé" });
    }

    // Génération du token aléatoire
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1h
    await user.save();

    // Envoi email de réinitialisation
    await sendResetPasswordEmail(email, resetToken);

    res.status(200).json({ message: "Email de réinitialisation envoyé" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ================================
// Réinitialisation du mot de passe
// ================================
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Vérifier si token valide + pas expiré
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Lien invalide ou expiré, recommencez" });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
