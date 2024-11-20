import express from "express";
import axios from "axios";

const router = express.Router();

const PASSWORDS_URL = 'https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/Common-Credentials/10k-most-common.txt';

/**
 * @swagger
 * /features/check-password:
 *   get:
 *     summary: Vérifie si un mot de passe est dans la liste des mots de passe les plus communs
 *     tags: [Feature - Password check]
 *     parameters:
 *       - in: query
 *         name: password
 *         required: true
 *         description: Le mot de passe à vérifier
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Résultat de la vérification du mot de passe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message indiquant si le mot de passe est commun ou peu commun
 *       400:
 *         description: Bad Request - Le mot de passe est requis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Erreur indiquant que le mot de passe est requis
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur pour l'échec de la récupération des mots de passe
 */

router.get('/', async (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ error: "Le mot de passe est requis." });
    }

    try {
        const response = await axios.get(PASSWORDS_URL);

        const passwordsList = response.data.split('\n').map(line => line.trim());

        if (passwordsList.includes(password)) {
            return res.status(200).json({ message: "Le mot de passe est très commun." });
        } else {
            return res.status(200).json({ message: "Le mot de passe est peu commun." });
        }
    } catch (error) {
        console.error("Erreur lors de la récupération du fichier des mots de passe :", error);
        return res.status(500).json({ error: "Une erreur est survenue lors de la récupération des mots de passe." });
    }
});

export default router;
