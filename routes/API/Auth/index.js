import express from "express";
import bcrypt from "bcrypt";
//import Users from "../../../models/users.js";
import jwt from "jsonwebtoken";
import config from "../../../config/config.json" assert {type: 'json'};
import axios from "axios";

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const {name, firstname, email, password} = req.body;
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await Users.findOne({where: {email: email}});
        if (existingUser) {
            return res.status(400).json({message: "L'utilisateur existe déjà."});
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur
        const newUser = await Users.create({
            name: name,
            firstname: firstname,
            email: email,
            password: hashedPassword
        });

        return res.status(201).json({message: "Inscription réussie.", user: newUser});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Erreur lors de l'inscription de l'utilisateur."});
    }
});

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await Users.findOne({where: {email: email}});
        if (!user) {
            return res.status(401).json({message: "Identifiants invalides."});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({message: "Identifiants invalides."});
        }
        console.log("config.JWT_SECRET", config.JWT_SECRET);
        const token = jwt.sign({id: user.id, email: user.email}, config.JWT_SECRET, {expiresIn: '365d'});

        return res.json({message: "Connexion réussie.", token: token});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Erreur lors de la connexion de l'utilisateur."});
    }
});


export default router;