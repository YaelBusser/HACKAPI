import {PrismaClient} from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function (req, res, next) {
    const token = req.headers['authorization'];
    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        const user = await prisma.users.findFirst({
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