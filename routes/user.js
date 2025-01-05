const express = require('express');
const pool = require('../db');
const authenticateToken = require('../middleware/authMiddleware');
const { getTrain, getBookingById, createBooking } = require('../controllers/userController');

const router = express.Router();

router.get('/trains', getTrain);
router.get('/bookings/:id', authenticateToken, getBookingById);
router.post('/book', authenticateToken, createBooking);

module.exports = router;