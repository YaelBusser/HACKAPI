import express from "express";
import http from "http";
import {PrismaClient} from "@prisma/client";
import bodyParser from "body-parser";
import {config as configDotenv} from 'dotenv';
import cors from "cors";
import {swaggerDocs, swaggerUi} from "./swagger/swagger.js";

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

// Routes API
import UsersRoutes from "./routes/API/Users/index.js";
import LogsRoutes from "./routes/API/Logs/index.js";
import AccessFeaturesRoutes from "./routes/API/AccessFeatures/index.js";
import FeaturesRoutes from "./routes/API/Features/index.js";

app.use(logsMiddleware);

app.use('/', express.Router().get("/", (req, res) => {
        return res.json("Hello world ! API working...");
    }
));
app.use('/user', UsersRoutes);
app.use('/Logs', [verifyToken, isAdmin], LogsRoutes);
app.use('/accessFeatures', [verifyToken, isAdmin], AccessFeaturesRoutes);
app.use('/features', FeaturesRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.get("/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerDocs);
});

// Démarrage du serveur
server.listen(port, () => console.log(`Server running on http://localhost:${port}`));