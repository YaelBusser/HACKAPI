import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.get('/', async (req, res) => {
    const { email, count } = req.query;

    if (!email || !count || isNaN(count) || count <= 0) {
        return res.status(400).json({
            message: "Veuillez fournir une adresse email valide et un nombre positif d'emails à envoyer.",
        });
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_APP_DEVMDS,
            pass: process.env.PASSWORD_APP_DEVMDS,
        },
    });

    const sendEmail = async (to, subject, text) => {
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_APP_DEVMDS,
                to,
                subject,
                text,
            });
            console.log(`Email envoyé avec succès à ${to}`);
        } catch (error) {
            console.error(`Erreur lors de l'envoi de l'email à ${to}:`, error);
            throw error;
        }
    };

    try {
        for (let i = 0; i < parseInt(count); i++) {
            await sendEmail(
                email,
                `HACKAPI Email Spammer - Email ${i + 1}`,
                `Ceci est l'email numéro ${i + 1}.`
            );
        }
        res.status(200).json({
            message: `${count} emails envoyés avec succès à ${email}.`,
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de l'envoi des emails.",
        });
    }
});

export default router;
