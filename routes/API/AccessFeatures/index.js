import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @swagger
 * /access-features/grant:
 *   post:
 *     summary: Grant permission to a user for a feature
 *     tags: [Access Features]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_feature:
 *                 type: integer
 *                 example: 1
 *               username:
 *                 type: string
 *                 example: "user123"
 *     responses:
 *       201:
 *         description: Permission granted successfully.
 *       400:
 *         description: Bad request - missing parameters or invalid feature ID.
 *       404:
 *         description: User or feature not found.
 *       409:
 *         description: Permission already granted.
 *       500:
 *         description: Internal server error.
 */
router.post('/grant', async (req, res) => {
    const { id_feature, username } = req.body;

    try {
        if (!id_feature || !username) {
            return res.status(400).json({ message: "Feature ID and username are required." });
        }

        const featureId = parseInt(id_feature, 10);
        if (isNaN(featureId)) {
            return res.status(400).json({ message: "Feature ID must be a valid integer." });
        }

        const user = await prisma.users.findFirst({ where: { username } });
        if (!user) return res.status(404).json({ message: "User not found!" });

        const feature = await prisma.features.findFirst({ where: { id: featureId } });
        if (!feature) return res.status(404).json({ message: "Feature not found!" });

        const existingAccess = await prisma.users_access_features.findFirst({
            where: { id_user: user.id, id_feature: featureId }
        });
        if (existingAccess) {
            return res.status(409).json({ message: "Permission already granted." });
        }

        await prisma.users_access_features.create({
            data: {
                id_user: user.id,
                id_feature: featureId,
            },
        });

        return res.status(201).json({ message: "Permission granted successfully." });
    } catch (error) {
        console.error("Error granting permission:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * @swagger
 * /access-features/revoke:
 *   delete:
 *     summary: Revoke permission from a user for a feature
 *     tags: [Access Features]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_feature:
 *                 type: integer
 *                 example: 1
 *               username:
 *                 type: string
 *                 example: "user123"
 *     responses:
 *       200:
 *         description: Permission revoked successfully.
 *       400:
 *         description: Bad request - missing parameters or invalid feature ID.
 *       404:
 *         description: User or access not found.
 *       500:
 *         description: Internal server error.
 */
router.delete('/revoke', async (req, res) => {
    const { id_feature, username } = req.body;

    try {
        if (!id_feature || !username) {
            return res.status(400).json({ message: "Feature ID and username are required." });
        }

        const featureId = parseInt(id_feature, 10);
        if (isNaN(featureId)) {
            return res.status(400).json({ message: "Feature ID must be a valid integer." });
        }

        const user = await prisma.users.findFirst({ where: { username } });
        if (!user) return res.status(404).json({ message: "User not found!" });

        const access = await prisma.users_access_features.findFirst({
            where: { id_user: user.id, id_feature: featureId }
        });
        if (!access) {
            return res.status(404).json({ message: "Access not found!" });
        }

        await prisma.users_access_features.delete({
            where: { id_user_id_feature: { id_user: user.id, id_feature: featureId } },
        });

        return res.status(200).json({ message: "Permission revoked successfully." });
    } catch (error) {
        console.error("Error revoking permission:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * @swagger
 * /access-features:
 *   get:
 *     summary: Get all features and their associated users
 *     tags: [Access Features]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of features with their users.
 *       500:
 *         description: Internal server error.
 */
router.get('/', async (req, res) => {
    try {
        const permissions = await prisma.features.findMany({
            include: {
                users_access_features: {
                    include: {
                        users: true
                    }
                },
            },
        });
        if (permissions.length > 0) {
            const formattedPermissions = permissions.map((feature) => ({
                feature: feature.label,
                users: feature.users_access_features.map((access) => ({
                    id: access.users.id,
                    username: access.users.username,
                })),
            }));
            return res.status(200).json(formattedPermissions);
        } else {
            return res.status(200).json({ message: "Aucune fonctionnalité" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;