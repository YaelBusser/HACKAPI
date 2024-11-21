import express from "express";
import {PrismaClient} from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();
const router = express.Router();
/**
 * @swagger
 * /features/retrieve-all-domains:
 *   get:
 *     summary: Récupère tous les sous-domaines d'un domaine donné
 *     tags: [Feature - Retrieve all domains & subdomains]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: domain
 *         required: true
 *         description: Le nom de domaine pour lequel récupérer les sous-domaines
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sous-domaines récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 domain:
 *                   type: string
 *                   description: Le domaine principal
 *                 subdomains:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Bad Request - Domaine manquant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

router.get('/', async (req, res) => {
    const {domain} = req.query;

    if (!domain) {
        return res.status(400).json({error: "Le domaine est requis."});
    }

    try {
        const subdomains = await axios.get(`https://api.securitytrails.com/v1/domain/${domain}/subdomains`, {
            headers: {
                "APIKEY": `${process.env.SECURITY_TRAILS_API_KEY}`
            }
        });
        /*
        const allDomainsAssociated = await axios.get(`https://api.securitytrails.com/v1/domain/${domain}/associated`, {
            headers: {
                "APIKEY": `${process.env.SECURITY_TRAILS_API_KEY}`
            }
        });
        */
        const allSubdomains = subdomains.data.subdomains.map(subdomain => `${subdomain}.${domain}`);
        return res.status(200).json({
            //allDomainsAssociated,
            domainsAssociated: "Erreur : Besoin de payer une licence à 500€/mois !",
            allSubdomains
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des sous-domaines :", error.message);

        if (error.response) {
            return res.status(error.response.status).json({
                error: error.response.data || "Erreur depuis l'API SecurityTrails",
            });
        }

        return res.status(500).json({error: "Une erreur interne est survenue."});
    }
});


export default router;
