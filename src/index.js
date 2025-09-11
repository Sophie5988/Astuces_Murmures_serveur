process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// oblogé de le mettre quand je suis chez sofip car probleme de certificat Proxy

import express from "express"; // framework utilisé par le serveur node

import dotenv from "dotenv"; // permet de lire les variables d'environnement contenues dans .env

import cookieParser from "cookie-parser";
import cors from "cors";

import routes from "./routes/index.js"; // permet de préciser ou sont les routes

import { connectDB } from "./lib/db.js"; // récupère la connexion à la base de données

// indique que l'on va utiliser .env
dotenv.config();

const PORT = process.env.PORT;

// indique que l'application utilise express
const app = express();

// indique que l'on va pouvoir traduire le JSON et que l'on va utiliser des cookies
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [process.env.DEPLOY_FRONT_URL, process.env.CLIENT_URL],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

// chaque route localhost:5000 sera redirigé vers le dossier routes
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Le serveur est démarré sur le port ${PORT}`);
  connectDB();
});
