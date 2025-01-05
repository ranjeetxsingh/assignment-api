const express = require('express');
const pool = require('../db');
const { addTrain, updateSeatByTrainId } = require('../controllers/adminController');
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.use((req, res, next) => {
    const apiKey = req.headers['admin-api-key'];
    if (apiKey !== process.env.ADMIN_API_KEY) return res.status(403).json({ error: 'Forbidden' });
    next();
});


router.post('/addTrain', authenticateToken, authorizeRoles("admin"), addTrain);
router.put('/updateTrain/:train_id', authenticateToken, authorizeRoles("admin"), updateSeatByTrainId);


module.exports = router;