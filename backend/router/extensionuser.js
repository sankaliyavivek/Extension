const express = require('express');
const router = express.Router();
const ExtensionUser = require('../modal/extensionmodal');
const bcrypt = require('bcryptjs');
const JWt = require('jsonwebtoken');


router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    // const hashedPassword = await bcrypt.hash(password,10);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = ExtensionUser.create({ name, email, password: hashedPassword });
    res.json({ message: 'user created successfully', user });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter both email and password' });
    }

    try {
        const user = await ExtensionUser.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({
            message: 'User logged in successfully',
            user: { name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/logout', (req, res) => {
    res.json({ message: 'User logged out successfully' });
});


module.exports = router;
