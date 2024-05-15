import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

function AuthJTW(req, res, next) {
    const token = req.cookies.token;
    console.log(token);

    if (!token) {
        return res.status(401).json({ message: 'Pas de token !' });
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Erreur de vérification du token' });
        }
        req.user = decoded;
        next();
    });
}

export default AuthJTW;
