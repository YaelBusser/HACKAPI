import express from "express";
import {PrismaClient} from "@prisma/client";
import {exec} from "child_process";

const prisma = new PrismaClient();
const router = express.Router();

const pingProcesses = {};

const pingIP = (ip, callback) => {
    exec(`ping ${ip}`, (error, stdout, stderr) => {
        if (error) {
            callback(`Error pinging ${ip}: ${stderr}`);
        } else {
            callback(`Ping result for ${ip}: ${stdout}`);
        }
    });
};

/**
 * @swagger
 * /features/ddos/start:
 *   get:
 *     summary: Démarre un ping continu pour une adresse IP spécifiée.
 *     description: Lance un ping toutes les secondes vers l'adresse IP donnée.
 *     tags: [Feature - DDOS]
 *     parameters:
 *       - in: query
 *         name: ip
 *         required: true
 *         description: L'adresse IP à pinguer.
 *         schema:
 *           type: string
 *           example: "192.168.1.1"
 *     responses:
 *       200:
 *         description: Ping démarré avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message confirmant que le ping est en cours.
 *       400:
 *         description: Le ping est déjà en cours pour cette adresse IP.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message d'erreur lorsque le ping est déjà en cours pour cette IP.
 *       500:
 *         description: Erreur interne du serveur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur en cas de problème serveur.
 */

router.get("/start", async (req, res) => {
    const {ip} = req.query;

    if (pingProcesses[ip]) {
        return res.status(400).json({message: `Ping déjà en cours pour l'adresse IP ${ip}.`});
    }

    pingProcesses[ip] = setInterval(() => {
        pingIP(ip, (result) => {
            console.log(result);
        });
    }, 1000);

    res.status(200).json({message: `Ping en cours pour l'adresse IP ${ip} chaque seconde.`});
});

/**
 * @swagger
 * /features/ddos/stop:
 *   get:
 *     summary: Arrête le ping en cours pour une adresse IP spécifiée.
 *     description: Permet d'arrêter un ping en cours vers l'adresse IP donnée.
 *     tags: [Feature - DDOS]
 *     parameters:
 *       - in: query
 *         name: ip
 *         required: true
 *         description: L'adresse IP pour laquelle arrêter le ping.
 *         schema:
 *           type: string
 *           example: "192.168.1.1"
 *     responses:
 *       200:
 *         description: Ping arrêté avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message confirmant que le ping a été arrêté.
 *       400:
 *         description: Aucun ping en cours pour cette adresse IP.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message d'erreur lorsque aucun ping n'est en cours pour cette IP.
 *       500:
 *         description: Erreur interne du serveur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur en cas de problème serveur.
 */

router.get("/stop", async (req, res) => {
    const {ip} = req.query;

    if (!pingProcesses[ip]) {
        return res.status(400).json({message: `Aucun ping en cours pour l'adresse IP ${ip}.`});
    }

    clearInterval(pingProcesses[ip]);
    delete pingProcesses[ip];

    res.status(200).json({message: `Ping arrêté pour l'adresse IP ${ip}.`});
});

export default router;
