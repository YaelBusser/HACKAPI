import express from "express";
import {PrismaClient} from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router = express.Router();

router.use(async (req, res, next) => {
    try {
        let userId = null;
        if(req.headers.authorization){
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
        }


        await prisma.logs.create({
            data: {
                id_user: userId || null,
                description: req.method + ' ' + req.originalUrl,
                date_log: new Date(),
                id_feature: req.body.feature ? req.body.feature : null,
            },
        });
    } catch (error) {
        console.error("Failed to log action:", error);
    }
    next();
});

router.post('/', async (req, res) => {
    res.send('Action logged');
});

export default router;