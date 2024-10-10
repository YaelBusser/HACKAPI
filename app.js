import express from "express";
import http from "http";
import {Sequelize} from "sequelize";
import bodyParser from "body-parser";
import config from "./config/config.json" assert {type: 'json'};
import {config as configDotenv} from 'dotenv';

import cors from "cors";

configDotenv();


// Configuration initiale
const app = express();
const port = config.portApp;
const server = http.createServer(app);
const sequelize = new Sequelize(config.production);


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
        await sequelize.authenticate();
        console.log('Connexion à la base de données établie avec succès.');
    } catch (error) {
        console.error('Impossible de se connecter à la base de données:', error);
    }
})();

// Routes API
import AuthRoutes from "./routes/API/Auth/index.js";


app.use('/auth', AuthRoutes);
//app.use('/profile', ProfileRoutes);

// Démarrage du serveur
server.listen(port, () => console.log(`Server running on http://localhost:${port}`));