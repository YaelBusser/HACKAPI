import {PrismaClient} from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET;

export default async function (req, res, next) {
    const token = req.headers['x-access-token'] || req.headers['authorization'];

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await prisma.users.findUnique({
            where: {id: decoded.id},
            include: {roles: true}
        });

        if (!user || user.roles.label !== 'admin') {
            return res.status(401).send({message: 'Unauthorized!'});
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).send({message: 'Invalid token!'});
    }
};