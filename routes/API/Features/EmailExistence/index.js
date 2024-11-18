import express from "express";
import axios from "axios";

const router = express.Router();

/**
 * @swagger
 * /email-verifier:
 *   get:
 *     summary: Verify an email address
 *     tags: [Feature - Email Existence]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         description: The email address to verify
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verification result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Verification status
 *                 result:
 *                   type: string
 *                   description: Additional information about the email
 *       400:
 *         description: Bad Request - Email is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

router.get('/', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    try {
        const response = await axios.get(`https://api.hunter.io/v2/email-verifier`, {
            params: {
                email: email,
                api_key: process.env.API_KEY_HUNTER_IO,
            },
        });

        const verificationData = response.data.data;
        return res.status(200).json({
            status: verificationData.status,
            result: verificationData.result || "Unknown",
        });
    } catch (error) {
        console.error("Error verifying email:", error.message);

        if (error.response) {
            return res.status(error.response.status).json({
                message: error.response.data || "Error from Hunter.io API",
            });
        }

        return res.status(500).json({ message: "Internal server error." });
    }
});

export default router;
