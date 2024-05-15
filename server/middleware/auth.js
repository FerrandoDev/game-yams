import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

function AuthJWT(req, res, next) {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'Pas de token !' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log(token);

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Erreur de vérification du token' });
        }

        req.user = decoded;
        next();
    });
}

export default AuthJWT;
