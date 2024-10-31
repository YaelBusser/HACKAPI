import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Retrieve logs
 *     tags: [Logs]
 *     description: Fetches a list of logs filtered by username or feature ID, or both. If no filter is provided, returns the most recent logs.
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: Username to filter logs
 *       - in: query
 *         name: id_feature
 *         schema:
 *           type: integer
 *         description: Feature ID to filter logs
 *     responses:
 *       200:
 *         description: List of logs retrieved successfully
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
 *       400:
 *         description: Invalid query parameter
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
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
            const idFeatureInt = parseInt(id_feature);
            if (isNaN(idFeatureInt)) {
                return res.status(400).json({ message: "Invalid feature ID format." });
            }
            query.id_feature = idFeatureInt;
        }

        const logs = await prisma.logs.findMany({
            where: Object.keys(query).length > 0 ? query : undefined,
            orderBy: { date_log: 'desc' }
        });

        return res.status(200).json(logs);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
