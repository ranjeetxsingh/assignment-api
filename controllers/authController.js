const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/index')

const register = async (req, res) => {
    const { username, password, role } = req.body;
    if(!(['user', 'admin'].includes(role))){
        return res.status(400).json({error: 'Invalid role'});
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
            [username, hashedPassword, role]
        );
        res.status(200).json({ message: 'user registered', user: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const login = async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const user = await pool.query(
            'SELECT * FROM users WHERE username = $1 AND role = $2',
            [username, role]
        );

        if(!user.rows.length)   return res.status(401).json({error: "Invalid Credentials"});
        const isValid = await bcrypt.compare(password, user.rows[0].password);
        if(!isValid)    return res.status(401).json({ error: 'Invalid Credentials'});

        const token = jwt.sign(
            { id: user.rows[0].id, role: user.rows[0].role },
            process.env.JWT_SECRET,
            { expiresIn: "1h"}
        );
        res.status(200).json({message: "Login successful", token});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

module.exports = {
    register,
    login,
}
