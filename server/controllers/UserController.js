import User from "../models/User.js";

export const signUser = async (req , res ) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
    }
    catch (err) {
        console.error(err)
        res.status(500).send("Erreur lors de l'ajout de l'utilisateur");

    }
}