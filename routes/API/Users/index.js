import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../../app.js";
import isAdmin from "../../../middlewares/isAdmin.js";
import verifyToken from "../../../middlewares/verifyToken.js";

const router = express.Router();

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: User registration
 *     tags: [User]
 *     description: Creates a new user with the client role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registration successful
 *       403:
 *         description: User already exists
 *       500:
 *         description: Server error during registration
 */
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await prisma.users.findFirst({ where: { username } });
        if (existingUser) return res.status(403).json({ message: "User already exists." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const clientRole = await prisma.roles.findFirst({ where: { label: "client" } });
        const newUser = await prisma.users.create({
            data: { username, password: hashedPassword, id_role: clientRole.id },
        });

        return res.status(201).json({ message: "Registration successful.", user: newUser });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error during user registration." });
    }
});

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User login
 *     tags: [User]
 *     description: Authenticates a user and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Missing username or password
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error during login
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: "Username and password are required." });

        const user = await prisma.users.findFirst({ where: { username } });
        if (!user) return res.status(401).json({ message: "Invalid credentials." });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials." });

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '365d' });
        await prisma.users.update({ where: { id: user.id }, data: { token } });

        return res.status(200).json({ message: "Login successful.", token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error during login." });
    }
});

/**
 * @swagger
 * /user:
 *   delete:
 *     summary: Delete a user
 *     tags: [User]
 *     description: Deletes a user specified by username.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: User successfully deleted
 *       403:
 *         description: Access denied or forbidden action
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error during deletion
 */
router.delete('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const { username } = req.body;
        const user = await prisma.users.findFirst({ where: { username } });
        if (!user) return res.status(404).json({ message: "User not found." });

        if (user.username === "admin") return res.status(403).json({ message: "Cannot delete the admin user!" });

        await prisma.users.delete({ where: { id: user.id } });
        return res.status(200).json({ message: "User successfully deleted." });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error during user deletion." });
    }
});

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: User logout
 *     tags: [User]
 *     description: Invalidates the logged-in user's token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error during logout
 */
router.post('/logout', verifyToken, async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.users.findFirst({ where: { id: decodedToken.id } });
        if (!user) return res.status(404).json({ message: "User not found." });

        await prisma.users.update({ where: { id: user.id }, data: { token: null } });
        return res.status(200).json({ message: "Logout successful." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error during logout." });
    }
});

export default router;
