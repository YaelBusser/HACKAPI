import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router = express.Router();

router.use(async (req, res, next) => {
    res.on('finish', async () => {
        let userId = null;

        // Vérification du token JWT pour obtenir l'ID de l'utilisateur
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.id;
            } catch (error) {
                console.error("JWT verification failed:", error);
            }
        }

        try {
            const featureId = req.body.id_feature ? parseInt(req.body.id_feature, 10) : null;

            await prisma.logs.create({
                data: {
                    id_user: userId || null,
                    description: req.method + ' ' + req.originalUrl,
                    date_log: new Date(),
                    id_feature: !isNaN(featureId) ? featureId : null,
                    status_code: res.statusCode,
                },
            });
        } catch (error) {
            console.error("Failed to log action:", error);
        }
    });
    next();
});

export default router;
