import jwt from "jsonwebtoken";

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, 'djbeiuedui', (err, user) => {
            if (err) {
                return res.sendStatus(403).json({isAuthenticated: false});
            }

            req.user = user;
            next();
        });
    } else {
        console.log("test");
        res.sendStatus(403).json({isAuthenticated: false});
    }
};

export default authenticateJWT