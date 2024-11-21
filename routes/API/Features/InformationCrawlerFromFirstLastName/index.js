import express from 'express';
import {getJson} from "serpapi";

const router = express.Router();

/**
 * @swagger
 * /features/crawler:
 *   get:
 *     summary: Recherche des résultats sur Google en fonction des paramètres fournis
 *     tags: [Feature - Crawler]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: firstname
 *         required: true
 *         description: Le prénom de la personne à rechercher.
 *         schema:
 *           type: string
 *       - in: query
 *         name: lastname
 *         required: true
 *         description: Le nom de famille de la personne à rechercher.
 *         schema:
 *           type: string
 *       - in: query
 *         name: countryCode
 *         required: true
 *         description: Le code pays pour spécifier la localisation de la recherche.
 *         schema:
 *           type: string
 *           example: "us"
 *     responses:
 *       200:
 *         description: Résultats de la recherche
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     description: Le titre de la page de résultats
 *                   link:
 *                     type: string
 *                     description: L'URL de la page
 *                   source:
 *                     type: string
 *                     description: La source de la page
 *                   description:
 *                     type: string
 *                     description: Un extrait de la page
 *       400:
 *         description: Bad Request - Paramètres manquants ou invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur si un ou plusieurs paramètres sont manquants ou invalides
 *       500:
 *         description: Internal Server Error - Erreur lors de l'appel à SerpApi ou du traitement des résultats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur en cas de problème avec le serveur
 */

router.get('/', async (req, res) => {
    const {firstname, lastname, countryCode} = req.query;

    await getJson({
        engine: "google",
        q: `${firstname} ${lastname}`,
        gl: countryCode,
        api_key: process.env.SERPAPI_KEY
    }, (json) => {
        const results = json["organic_results"].map(result => ({
            title: result.title,
            link: result.link,
            source: result.source,
            description: result.snippet
        }));

        res.json(results);
    });
});

export default router;
