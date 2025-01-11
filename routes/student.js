const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

router.get('/', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        res.status(200).json({ username: decoded.username });
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
});

module.exports = router;