import express from "express";
import {PrismaClient} from "@prisma/client";
import verifyToken from "../../../middlewares/verifyToken.js";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET;

router.post('/grant', async (req, res) => {
    const {id_feature} = req.body;

    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, SECRET_KEY);
        const id_user = decoded.id;

        const feature = await prisma.features.findFirst({where: {id: id_feature}});
        if (!feature) return res.status(404).json({message: "Feature not found!"});

        await prisma.users_access_features.create({
            data: {
                id_user,
                id_feature,
            },
        });

        return res.status(201).json({message: "Permission granted successfully."});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal server error"});
    }
});

router.delete('/revoke', async (req, res) => {
    const {id_feature} = req.body;

    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, SECRET_KEY);
        const id_user = decoded.id;

        const access = await prisma.users_access_features.findFirst({
            where: {id_user, id_feature},
        });
        if (!access) return res.status(404).json({message: "Access not found!"});

        await prisma.users_access_features.delete({
            where: {id: access.id},
        });

        return res.status(200).json({message: "Permission revoked successfully."});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal server error"});
    }

});

router.get('/', async (req, res) => {
    try {
        const permissions = await prisma.features.findMany({
            include: {
                users_access_features: {
                },
            },
        });        console.log(permissions);
        if (permissions.length > 0) {
            const formattedPermissions = permissions.map((feature) => ({
                feature: feature.name,
                users: feature.users_access_features.map((access) => ({
                    id: access.user.id,
                    username: access.user.username,
                })),
            }));
            return res.status(200).json(formattedPermissions);
        } else {
            return res.status(200).json({message: "Aucuns "});
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal server error"});
    }
});

export default router;
