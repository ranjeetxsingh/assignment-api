const express = require('express');
const pool = require('../db');

const router = express.Router();

router.use((req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.ADMIN_API_KEY) return res.status(403).json({ error: 'Forbidden' });
    next();
});

router.post('/trains', async (req, res) => {
    const { train_name, source, destination, total_seats } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO trains (train_name, source, destination, total_seats, available_seats) VALUES ($1, $2, $3, $4, $4) RETURNING *',
            [train_name, source, destination, total_seats]
        );
        res.status(201).json({ message: 'Train added', train: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/trains/:train_id', async (req, res) => {
    const { train_id } = req.params;
    const { total_seats } = req.body;

    try {
        await pool.query('UPDATE trains SET total_seats = $1, available_seats = $1 WHERE id = $2', [total_seats, train_id]);
        res.status(200).json({ message: 'Train seats updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;