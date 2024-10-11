import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {prisma} from "../../../app.js";
import isAdmin from "../../../middlewares/isAdmin.js";
const router = express.Router();
router.post('/register', async (req, res) => {
    try {
        const {username, password} = req.body;
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.users.findFirst({where: {username: username}});
        if (existingUser) {
            return res.status(400).json({message: "L'utilisateur existe déjà."});
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        const clientRole = await prisma.roles.findFirst({where: {label: "client"}});
        const roleId = clientRole.id;
        const newUser = await prisma.users.create({
            data: {
                username: username,
                password: hashedPassword,
                id_role: roleId,
            }
        });

        return res.status(201).json({message: "Inscription réussie.", user: newUser});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Erreur lors de l'inscription de l'utilisateur."});
    }
});

router.post('/login', async (req, res) => {
    try {
        const {username, password} = req.body;

        const user = await prisma.users.findFirst({where: {username: username}});
        if (!user) {
            return res.status(401).json({message: "Identifiants invalides."});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({message: "Identifiants invalides."});
        }
        const token = jwt.sign({id: user.id, username: user.username}, process.env.JWT_SECRET, {expiresIn: '365d'});
        await prisma.users.update({
            where: {
                id: user.id,
            },
            data: {
                token: token,
            },
        });
        return res.json({message: "Connexion réussie.", token: token});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Erreur lors de la connexion de l'utilisateur."});
    }
});

router.delete('/', isAdmin, async (req, res) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({message: "Token d'authentification manquant."});
        }
        const token = req.headers.authorization.split(' ')[1];
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decodedToken);
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({message: "Token invalide ou malformé."});
            }
            throw error;
        }
        const adminUser = await prisma.users.findFirst({where: {id: decodedToken.id}});
        const roleAdminId = await prisma.roles.findFirst({where: {label: "admin"}});
        console.log("roleAdminId", roleAdminId);
        if (!adminUser || adminUser.id_role !== roleAdminId.id) {
            return res.status(403).json({message: "Accès refusé."});
        }

        const {username} = req.body;
        const user = await prisma.users.findFirst({where: {username: username}});

        if (!user) {
            return res.status(404).json({message: "Utilisateur non trouvé."});
        }

        await prisma.users.delete({where: {id: user.id}});
        return res.status(200).json({message: "Utilisateur supprimé avec succès."});
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Erreur lors de la suppression de l'utilisateur."});
    }
});

export default router;