import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET;

export default async function (req, res, next) {
    try {
        // Récupérer l'en-tête d'authentification et le token
        const authHeader = req.headers.authorization;
        const token = authHeader.split(" ")[1];

        // Vérifier le token JWT
        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.id;

        // Chercher l'utilisateur dans la base de données
        const user = await prisma.users.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Chercher le rôle de l'utilisateur dans la table `roles`
        const role = await prisma.roles.findUnique({ where: { id: user.id_role } });

        // Vérifier si le rôle de l'utilisateur est 'admin'
        if (role && role.label === 'admin') {
            return next(); // Si l'utilisateur a le rôle 'admin', il peut passer directement
        }

        // Extraire le nom de la fonctionnalité de l'URL (le segment après /features/)
        const regex = /\/features\/([^/?]+)/;
        const match = req.originalUrl.match(regex);
        const featureName = match ? match[1] : null;
        if (!featureName) {
            return res.status(400).json({ message: "Nom de fonctionnalité manquant dans l'URL." });
        }

        // Vérifier si ce nom de fonctionnalité correspond à un tag_route dans la table features
        const feature = await prisma.features.findFirst({
            where: {
                tag_route: featureName,
            },
        });

        if (!feature) {
            return res.status(404).json({ message: `Fonctionnalité "${featureName}" non trouvée.` });
        }

        // Vérifier si l'utilisateur a accès à cette fonctionnalité via id_feature
        const userAccess = await prisma.users_access_features.findFirst({
            where: {
                id_user: userId,
                id_feature: feature.id, // Utilisation de l'id de la fonctionnalité trouvée
            },
        });

        if (!userAccess) {
            return res.status(403).json({ message: "Permission refusée pour cette fonctionnalité." });
        }

        // Si tout est ok, passer au middleware suivant
        next();

    } catch (error) {
        console.error(error);
        // Vérifier les erreurs liées au token JWT
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token invalide ou expiré" });
        }
        return res.status(500).json({ message: "Erreur du serveur" });
    }
}
