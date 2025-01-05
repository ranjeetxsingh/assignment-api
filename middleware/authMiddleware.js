const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    console.log("inside authenticateToken middleware")
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization ;
    if(authHeader) {
        token = authHeader.split(" ")[1];

        if (!token) return res.status(401).json({ error: 'Unauthorized' });
        
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
            console.log("The decoded user is: ", req.user);
            next();
        } catch (error) {
            res.status(400).json({message: "token is not valid"})
        }
    }
    else {
        return res.status(401).json({message:  "No token! authorization denied"});
    }
};

module.exports = authenticateToken;
