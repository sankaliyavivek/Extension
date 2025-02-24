const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ExtensionUser = require('../modal/extensionmodal');
const authMiddleware = require('../middleware/authMiddleware'); // Import auth middleware
const cookieParser = require('cookie-parser');

router.use(cookieParser()); // Enable cookie parsing

// **Register Route**
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    try {
        const existingUser = await ExtensionUser.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await ExtensionUser.create({ name, email, password: hashedPassword });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// **Login Route**
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Both email and password are required" });
    }

    try {
        const user = await ExtensionUser.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return res.status(401).json({ message: "Invalid email or password" });

        // Generate JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        // Store token in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Set secure in production
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ message: "Login successful", user: { name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// **Logout Route**
router.post('/logout', (req, res) => {
    res.clearCookie("token"); // Clear JWT cookie
    res.json({ message: "User logged out successfully" });
});

// // **Protected Route Example**
// router.get('/profile', authMiddleware, async (req, res) => {
//     try {
//         const user = await ExtensionUser.findById(req.user.id).select("-password");
//         res.json({ user });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// });

module.exports = router;
