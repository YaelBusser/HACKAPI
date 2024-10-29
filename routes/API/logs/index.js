import express from "express";
import jwt from "jsonwebtoken";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {
    const {username, featureId} = req.query;
    let query = {};
    try {
        if (username !== undefined || null) {
            const user = await prisma.users.findFirst({
                where: {username: username}
            });
            if (user) {
                console.log("user", user);
                query.id_user = user.id;

                if (featureId) {
                    query.id_feature = parseInt(featureId);
                }

                const logs = await prisma.logs.findMany({
                    where: query, orderBy: {
                        date_log: 'desc'
                    }
                });
                return res.json(logs);
            } else {
                return res.status(404).json({message: "User not found."});
            }
        }
    } catch (error) {
        res.status(500).json({error: error});
    }
});
export default router;