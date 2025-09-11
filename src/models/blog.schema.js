import mongoose, { Schema } from "mongoose";

// ==============================
// Définition du schéma de Blog
// ==============================
const blogSchema = new mongoose.Schema(
  {
    // ------------------------------
    // Titre obligatoire, minimum 3 caractères
    // ------------------------------
    title: {
      type: String,
      required: true,
      minLength: 3,
    },

    // ------------------------------
    // Phrase d’accroche obligatoire (max 150 caractères)
    // ------------------------------
    tagline: {
      type: String,
      required: true,
      maxLength: 150,
    },

    // ------------------------------
    // Contenu obligatoire, minimum 10 caractères
    // ------------------------------
    content: {
      type: String,
      required: true,
      minLength: 10,
    },

    // ------------------------------
    // URL de l'image optionnelle (stockée sur Supabase)
    // ------------------------------
    image: {
      type: String,
      default: null,
    },

    // ------------------------------
    // Auteur obligatoire (référence à un utilisateur)
    // ------------------------------
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ------------------------------
    // Liste des utilisateurs qui ont consulté l'article
    // (sert à suivre qui a vu l'article)
    // ------------------------------
    viewedBy: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
  },
  {
    // Ajoute automatiquement createdAt et updatedAt
    timestamps: true,
  }
);

// ==============================
// Création du modèle basé sur le schéma
// ==============================
const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
