import jwt from "jsonwebtoken";
import User from "../models/user.schema.js";

export const protect = async (req, res, next) => {
  // récupération du token attaché à la requête HTTP entrante
  const { token } = req.cookies;

  // action si aucun token présent
  if (!token) {
    return res.status(400).json({ message: "Accès interdit. Aucun token" });
  }

  try {
    // décryptage du token avec la clé secrète
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // on attache à la requête l'utilisateur récupéré en BDD grâce à l'ID stocké dans le token
    req.user = await User.findById(decoded.sub).select("-password");
    // on peut alors passer au controller
    next();
  } catch (error) {
    // action si token invalide
    console.error(error);
    return res.status(400).json({ message: "Accès interdit. Token invalide" });
  }
};
