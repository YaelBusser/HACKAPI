import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

/**
 * @swagger
 * /features/email-spammer:
 *   get:
 *     summary: Send multiple emails to a recipient
 *     tags: [Feature - Email spammer]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         description: The recipient's email address
 *         schema:
 *           type: string
 *       - in: query
 *         name: count
 *         required: true
 *         description: Number of emails to send
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Emails sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message with the number of emails sent
 *       400:
 *         description: Invalid input (missing or invalid email/count)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message explaining the issue
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message if something went wrong
 */


router.get('/', async (req, res) => {
    const { email, count, content } = req.query;

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
                content
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
