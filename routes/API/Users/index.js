import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../../app.js";
import isAdmin from "../../../middlewares/isAdmin.js";
import verifyToken from "../../../middlewares/verifyToken.js";

const router = express.Router();

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Inscription d'un utilisateur
 *     description: Crée un nouvel utilisateur avec le rôle de client.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inscription réussie
 *       500:
 *         description: Erreur lors de l'inscription
 */
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await prisma.users.findFirst({ where: { username } });
        if (existingUser) return res.status(403).json({ message: "L'utilisateur existe déjà." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const clientRole = await prisma.roles.findFirst({ where: { label: "client" } });
        const newUser = await prisma.users.create({
            data: { username, password: hashedPassword, id_role: clientRole.id },
        });

        return res.status(201).json({ message: "Inscription réussie.", user: newUser });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erreur lors de l'inscription de l'utilisateur." });
    }
});

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Connexion de l'utilisateur
 *     description: Authentifie un utilisateur et retourne un token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Identifiants invalides
 *       500:
 *         description: Erreur lors de la connexion
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: "Le nom d'utilisateur et le mot de passe sont requis." });

        const user = await prisma.users.findFirst({ where: { username } });
        if (!user) return res.status(401).json({ message: "Identifiants invalides." });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Identifiants invalides." });

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '365d' });
        await prisma.users.update({ where: { id: user.id }, data: { token } });

        return res.json({ message: "Connexion réussie.", token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erreur lors de la connexion de l'utilisateur." });
    }
});

/**
 * @swagger
 * /user:
 *   delete:
 *     summary: Supprime un utilisateur
 *     description: Supprime un utilisateur spécifié par le nom d'utilisateur.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur lors de la suppression
 */
router.delete('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const { username } = req.body;
        const user = await prisma.users.findFirst({ where: { username } });
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

        if (user.username === "admin") return res.status(403).json({ message: "Impossible de supprimer l'administrateur !" });

        await prisma.users.delete({ where: { id: user.id } });
        return res.status(200).json({ message: "Utilisateur supprimé avec succès." });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur." });
    }
});

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Déconnexion de l'utilisateur
 *     description: Invalide le token de l'utilisateur connecté.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *       401:
 *         description: Token invalide
 *       500:
 *         description: Erreur lors de la déconnexion
 */
router.post('/logout', verifyToken, async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.users.findFirst({ where: { id: decodedToken.id } });
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

        await prisma.users.update({ where: { id: user.id }, data: { token: null } });
        return res.status(200).json({ message: "Déconnexion réussie." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Erreur lors de la déconnexion de l'utilisateur." });
    }
});

export default router;