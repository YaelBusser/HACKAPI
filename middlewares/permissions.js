import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET;

export default function () {
    return async (req, res, next) => {
        try {
            // Récupération du token JWT depuis les headers
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ message: "Token manquant ou invalide" });
            }

            const token = authHeader.split(" ")[1];

            // Décodage du token pour obtenir l'userId
            const decoded = jwt.verify(token, SECRET_KEY);
            const userId = decoded.id;

            // Vérification de l'existence de l'utilisateur
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }

            // Récupération de l'id de la fonctionnalité depuis le body de la requête
            const { id_feature } = req.body;
            if (!id_feature) {
                return res.status(400).json({ message: "ID de fonctionnalité manquant dans le corps de la requête." });
            }

            // Vérification dans la table `users_access_features` pour l'accès à la fonctionnalité
            const userAccess = await prisma.users_access_features.findFirst({
                where: {
                    id_user: userId,
                    id_feature: id_feature,
                },
            });

            if (!userAccess) {
                return res.status(403).json({ message: "Permission refusée pour cette fonctionnalité." });
            }

            next();
        } catch (error) {
            console.error(error);
            if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Token invalide ou expiré" });
            }
            return res.status(500).json({ message: "Erreur du serveur" });
        }
    };
};
