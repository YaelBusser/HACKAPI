import express from "express";
import jwt from "jsonwebtoken";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;

        const adminRole = await prisma.roles.findFirst({
            where: {label: 'admin'}
        });
        const adminUser = await prisma.users.findFirst({
            where: {id: user.id, id_role: adminRole.id}
        });

        if (!adminUser) return res.sendStatus(403);
        next();
    });
};

router.get('/', authenticateToken, async (req, res) => {
    const {userId, featureId} = req.query;

    let query = {};
    if (userId) query.id_user = parseInt(userId);
    if (featureId) query.id_feature = parseInt(featureId);

    try {
        const actions = await prisma.logs.findMany({
            where: query,
            include: {
                users: true,
                features: true
            },
            orderBy: {
                date_log: 'desc'
            }
        });
        res.json(actions);
    } catch (error) {
        res.status(500).json({error: 'Server error'});
    }
});

export default router;