const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer")) {
        return res.status(401).json({
            error: "Unauthorizated",
        })
    }

    const token = authorizationHeader.split(" ")[1];

    try {
        const loginSession = jwt.verify(token, "secretauth");
        res.locals.loginSession = loginSession;
        next();
    } catch (error) {    
        return res.status(401).json({
            status: 108,
            message: 'Token tidak valid atau kadaluwarsa',
            data: null
        })
    }
}

module.exports = authenticate;