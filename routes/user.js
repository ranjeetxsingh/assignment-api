const express = require('express');
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.get('/trains', async (req, res) => {
    const { source, destination } = req.query;
    try {
        const result = await pool.query(
            'SELECT * FROM trains WHERE source = $1 AND destination = $2',
            [source, destination]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/bookings/:id', authenticateToken, async (req, res) => {
    const bookingId = req.params.id;

    try {
        const result = await pool.query(
            'SELECT * FROM bookings WHERE id = $1 AND user_id = $2',
            [bookingId, req.user.id]
        );

        if (!result.rows.length) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post('/book', authenticateToken, async (req, res) => {
    const { train_id } = req.body;

    try {
        await pool.query('BEGIN');

        const train = await pool.query('SELECT * FROM trains WHERE id = $1 FOR UPDATE', [train_id]);

        if (!train.rows.length || train.rows[0].available_seats <= 0) {
            await pool.query('ROLLBACK');
            return res.status(400).json({ error: 'No seats available' });
        }

        await pool.query('UPDATE trains SET available_seats = available_seats - 1 WHERE id = $1', [train_id]);

        const booking = await pool.query(
            'INSERT INTO bookings (user_id, train_id) VALUES ($1, $2) RETURNING *',
            [req.user.id, train_id]
        );

        await pool.query('COMMIT');
        res.status(200).json({ message: 'Seat booked', booking: booking.rows[0] });
    } catch (err) {
        await pool.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
