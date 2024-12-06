const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
            [username, hashedPassword, role]
        );
        res.status(201).json({ message: 'User registered', user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post('/login', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const user = await pool.query(
            'SELECT * FROM users WHERE username = $1 AND role = $2',
            [username, role]
        );
        if (!user.rows.length) return res.status(401).json({ error: 'Invalid credentials' });

        const isValid = await bcrypt.compare(password, user.rows[0].password);
        if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user.rows[0].id, role: user.rows[0].role },
            process.env.JWT_SECRET
        );
        res.json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;
