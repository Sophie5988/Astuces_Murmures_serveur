import mongoose from "mongoose";

// Schéma Utilisateur (User)
const userSchema = new mongoose.Schema(
  {
    // Informations de base
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    }, // Identifiant unique (pseudo)

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    }, // Email unique

    password: {
      type: String,
      required: true,
    }, // Mot de passe hashé avec bcrypt

    avatar: {
      type: String,
      default: null,
    }, // URL de l'avatar (stocké via Supabase par ex.)

    // Sécurité - Réinitialisation mot de passe

    resetPasswordToken: {
      type: String,
      default: null,
    }, // Jeton aléatoire unique généré lors d'un "mot de passe oublié"

    resetPasswordExpires: {
      type: Date,
      default: null,
    }, // Date d’expiration du jeton (ex: +1h)
  },
  {
    timestamps: true, // Ajoute automatiquement createdAt et updatedAt
  }
);

// Création du modèle

const User = mongoose.model("User", userSchema);

export default User;
