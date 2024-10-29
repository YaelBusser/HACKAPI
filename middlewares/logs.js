import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router = express.Router();

router.use(async (req, res, next) => {
    res.on('finish', async () => {
        let userId = null;

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
            await prisma.logs.create({
                data: {
                    id_user: userId || null,
                    description: req.method + ' ' + req.originalUrl,
                    date_log: new Date(),
                    id_feature: req.body.feature ? req.body.feature : null,
                    status_code: res.statusCode
                },
            });
        } catch (error) {
            console.error("Failed to log action:", error);
        }
    });
    next();
});

export default router;
