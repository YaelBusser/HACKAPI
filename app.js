import express from "express";
import http from "http";
import {PrismaClient} from "@prisma/client";
import bodyParser from "body-parser";
import {config as configDotenv} from 'dotenv';
import cors from "cors";

configDotenv();

export const prisma = new PrismaClient();

// Configuration initiale
const app = express();
const port = process.env.PORT;
const server = http.createServer(app);

// CORS
app.use(cors());

// Middleware
app.use(bodyParser.urlencoded({extended: true}));
// bodyparser
app.use(bodyParser.json())
app.use(express.static('public'));

// Connexion à la base de données
(async () => {
    try {
        await prisma.$connect();
        console.log('Connexion à la base de données établie avec succès.');
    } catch (error) {
        console.error('Impossible de se connecter à la base de données:', error);
    }
})();

// Middlewares
import logsMiddleware from "./middlewares/logs.js";
import verifyToken from "./middlewares/verifyToken.js";
import isAdmin from "./middlewares/isAdmin.js";

app.use(logsMiddleware);

// Routes API
import UsersRoutes from "./routes/API/Users/index.js";
import LogsRoutes from "./routes/API/logs/index.js";

app.use('/', express.Router().get("/", (req, res) => {
        return res.json("Hello world ! API working...");
    }
));
app.use('/user', UsersRoutes);
app.use('/logs', [verifyToken, isAdmin], LogsRoutes);

// Démarrage du serveur
server.listen(port, () => console.log(`Server running on http://localhost:${port}`));

