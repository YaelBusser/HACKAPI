import express from "express";
import axios from "axios";

const router = express.Router();

const PASSWORDS_URL = 'https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/Common-Credentials/10k-most-common.txt';

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
