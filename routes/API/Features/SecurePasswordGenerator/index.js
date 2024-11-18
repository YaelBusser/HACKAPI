import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

const generateSecurePassword = (length = 12) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
};

/**
 * @swagger
 * /secure-password-generator:
 *   get:
 *     summary: Génère un mot de passe sécurisé
 *     tags: [Feature - Secure password generator]
 *     parameters:
 *       - in: query
 *         name: length
 *         required: false
 *         description: La longueur du mot de passe à générer. Par défaut, il est de 12 caractères.
 *         schema:
 *           type: integer
 *           default: 12
 *     responses:
 *       200:
 *         description: Mot de passe généré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 password:
 *                   type: string
 *                   description: Le mot de passe généré
 *       400:
 *         description: Bad Request - Longueur du mot de passe invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur concernant la longueur
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur pour tout problème survenu
 */

router.get('/', async (req, res) => {
    const { length = 12 } = req.query;

    if (isNaN(length) || length < 8 || length > 128) {
        return res.status(400).json({ error: "La longueur du mot de passe doit être un nombre entre 8 et 128." });
    }

    try {
        const password = generateSecurePassword(Number(length));

        return res.status(200).json({ password });
    } catch (error) {
        console.error("Erreur lors de la génération du mot de passe :", error);
        return res.status(500).json({ error: "Une erreur est survenue lors de la génération du mot de passe." });
    }
});

export default router;
