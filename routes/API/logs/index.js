import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Récupère les logs
 *     description: Récupère une liste de logs filtrés par nom d'utilisateur ou ID de fonctionnalité, ou les deux. Si aucun filtre n'est fourni, retourne les logs les plus récents.
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: Nom d'utilisateur pour filtrer les logs
 *       - in: query
 *         name: id_feature
 *         schema:
 *           type: integer
 *         description: ID de la fonctionnalité pour filtrer les logs
 *     responses:
 *       200:
 *         description: Liste des logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   id_user:
 *                     type: integer
 *                   id_feature:
 *                     type: integer
 *                   action:
 *                     type: string
 *                   date_log:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/', async (req, res) => {
    const { username, id_feature } = req.query;
    let query = {};

    try {
        if (username) {
            const user = await prisma.users.findFirst({
                where: { username: username }
            });

            if (!user) {
                return res.status(404).json({ message: "User not found!" });
            }
            query.id_user = user.id;
        }

        if (id_feature) {
            query.id_feature = parseInt(id_feature);
        }

        const logs = await prisma.logs.findMany({
            where: Object.keys(query).length > 0 ? query : undefined,
            orderBy: { date_log: 'desc' }
        });

        return res.status(200).json(logs);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

export default router;
