import express from "express";
import {PrismaClient} from "@prisma/client";
import {faker} from "@faker-js/faker";
import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @swagger
 * /features/generate-fake-identity:
 *   get:
 *     summary: Génère une fausse identité et l'enregistre dans un fichier JSON
 *     tags: [Feature - Fake Identity Generator]
 *     security:
 *        - bearerAuth: []
 *     responses:
 *       200:
 *         description: Fausse identité générée et sauvegardée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indique si l'opération a réussi
 *                 message:
 *                   type: string
 *                   description: Message confirmant la création du fichier
 *                 data:
 *                   type: object
 *                   description: Détails de l'identité générée
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       description: Prénom de la personne générée
 *                     lastName:
 *                       type: string
 *                       description: Nom de famille de la personne générée
 *                     email:
 *                       type: string
 *                       description: Email de la personne générée
 *                     phone:
 *                       type: string
 *                       description: Numéro de téléphone généré
 *                     birthdate:
 *                       type: string
 *                       format: date
 *                       description: Date de naissance générée
 *                     favoriteColor:
 *                       type: string
 *                       description: Couleur préférée générée
 *                     sex:
 *                       type: string
 *                       description: Sexe généré
 *                     bio:
 *                       type: string
 *                       description: Biographie générée
 *                     gender:
 *                       type: string
 *                       description: Genre généré
 *                     job:
 *                       type: string
 *                       description: Poste ou métier généré
 *                     address:
 *                       type: object
 *                       description: Adresse générée
 *                       properties:
 *                         street:
 *                           type: string
 *                           description: Rue de l'adresse
 *                         city:
 *                           type: string
 *                           description: Ville de l'adresse
 *                         state:
 *                           type: string
 *                           description: État ou région de l'adresse
 *                         postalCode:
 *                           type: string
 *                           description: Code postal
 *                         country:
 *                           type: string
 *                           description: Pays
 *       500:
 *         description: Erreur lors de la génération ou de la sauvegarde
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indique si l'opération a échoué
 *                 message:
 *                   type: string
 *                   description: Message d'erreur
 *                 error:
 *                   type: string
 *                   description: Détails de l'erreur
 */


router.get('/', async (req, res) => {
    try {
        const fakeIdentity = {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            birthdate: faker.date.birthdate(),
            favoriteColor: faker.color.human(),
            sex: faker.person.sex(),
            bio: faker.person.bio(),
            gender: faker.person.gender(),
            job: faker.person.jobTitle(),
            address: {
                street: faker.location.streetAddress(),
                city: faker.location.city(),
                state: faker.location.state(),
                postalCode: faker.location.zipCode(),
                country: faker.location.country(),
            },
        };

        const fileName = `${fakeIdentity.lastName.toLowerCase()}_${fakeIdentity.firstName.toLowerCase()}.json`;

        const filePath = path.join(__dirname, fileName);

        fs.writeFileSync(filePath, JSON.stringify(fakeIdentity, null, 2), "utf8");

        res.status(200).json({
            success: true,
            message: `Fichier ${fileName} créé avec succès dans ${filePath}.`,
            data: fakeIdentity,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Une erreur est survenue",
            error: error.message,
        });
    }
});

export default router;
