import express from "express";
import axios from "axios";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import {fileURLToPath} from "url";

const prisma = new PrismaClient();
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @swagger
 * /features/random-image-person:
 *   get:
 *     summary: Télécharge une image depuis "https://thispersondoesnotexist.com" et l'enregistre localement
 *     tags: [Feature - Random image generator]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Image téléchargée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message confirmant que l'image a été téléchargée avec succès
 *                 path:
 *                   type: string
 *                   description: Chemin du fichier image téléchargé
 *       500:
 *         description: Erreur lors du téléchargement de l'image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message d'erreur
 */


router.get('/', async (req, res) => {
    try {
        const imageUrl = "https://thispersondoesnotexist.com";

        const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
        const imageBuffer = response.data;

        const imageName = `${Date.now()}.jpg`;
        const filePath = path.join(__dirname, imageName);

        fs.writeFileSync(filePath, imageBuffer);

        res.json({ message: `Image téléchargée avec succès !`, path: filePath });
    } catch (error) {
        console.error("Erreur lors du téléchargement de l'image :", error);
        res.status(500).json({ message: "Erreur lors du téléchargement de l'image" });
    }
});

export default router;
