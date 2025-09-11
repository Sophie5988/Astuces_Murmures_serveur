import Blog from "../models/blog.schema.js";

// ==============================
// Créer un blog
// ==============================
export const createBlog = async (req, res) => {
  try {
    // On récupère tagline en plus du reste
    const { title, tagline, content, image } = req.body;

    // Vérification côté serveur (sécurité en plus de Yup côté front)
    if (!tagline || tagline.trim() === "") {
      return res
        .status(400)
        .json({ message: "La phrase d'accroche est obligatoire" });
    }

    // Création du blog avec tagline incluse
    const blog = await Blog.create({
      title,
      tagline,
      content,
      image, // URL Supabase
      author: req.user._id, // récupéré via middleware d'authentification
    });

    res.status(201).json(blog);
  } catch (error) {
    console.error("Erreur création blog:", error);
    res.status(400).json({ message: error.message });
  }
};

// ==============================
// Lister tous les blogs
// ==============================
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "username email avatar") // on ajoute avatar pour affichage
      .sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    console.error("Erreur récupération blogs:", error);
    res.status(400).json({ message: error.message });
  }
};
