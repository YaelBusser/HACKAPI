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
