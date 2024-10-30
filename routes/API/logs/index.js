import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

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
