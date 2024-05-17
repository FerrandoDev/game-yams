import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

export const signUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        newUser.password = await bcrypt.hash(newUser.password, 10);
        await newUser.save();
        res.redirect('/?showModal=true');
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de l'ajout de l'utilisateur");
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send('Veuillez saisir un email et un mot de passe.');
        }
        const user = await User.findOne({ email });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).send('Email ou mot de passe incorrect');
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.cookie('token', token, { maxAge: 3600000, httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });

        req.session.user = { chanceCount: user.game, username: user.username, id: user._id};
        req.session.save(err => {
            if (err) {
                console.error(err);
            }
            res.redirect('/game');
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur interne du serveur");
    }
};
