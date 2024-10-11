import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {prisma} from "../../../app.js";

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


export default router;