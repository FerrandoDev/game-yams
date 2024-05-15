import User from "../models/User.js";
import bcrypt from "bcrypt";

export const signUser = async (req , res ) => {
    try {
        const newUser = new User(req.body);
        newUser.password = await bcrypt.hash(newUser.password, 10);
        await newUser.save();
        res.redirect('/?showModal=true');
    }
    catch (err) {
        console.error(err)
        res.status(500).send("Erreur lors de l'ajout de l'utilisateur");

    }
}