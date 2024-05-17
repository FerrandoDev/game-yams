import Pastry from "../models/Pastry.js";
import User from "../models/User.js";

export const gameInfo = async (req, res) => {
    const pastriesAvailable = await getAvailablePastries();
    console.log(pastriesAvailable)
    if (pastriesAvailable.length > 0) {
        res.render('pages/game', {
            chanceCount: req.session.user.chanceCount,
            username: req.session.user.username,
            gameStatut: 'true'
        });
    } else {
        res.render('pages/game', {
            chanceCount: req.session.user.chanceCount,
            username: req.session.user.username,
            gameStatut: 'false'
        });
    }


}
export const PlayGame = async (req, res) => {
    if (!req.session.user || !req.session.user.username || !req.session.user.id) {
        return res.status(401).json({message: "Vous devez être connecté pour accéder à cette page."});
    }
    try {
        const user = await User.findById(req.session.user.id);
        if (!user) {
            return res.status(404).json({message: "Utilisateur non trouvé."});
        }
        if (user.game > 0) {
            user.game -= 1;
            req.session.user.chanceCount = user.game;
            await user.save();
            res.json({message: "Chance utilisée.", chanceCount: user.game});
        } else {
            res.status(400).json({message: "Vous n'avez plus de chances restantes."});
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Erreur interne du serveur."});
    }
}

export const winGame = async (req, res) => {
    try {
        const winNumber = req.params.pastries;
        const parts = winNumber.split('=');
        const numberOfPastriesWin = Number(parts[1]);
        console.log(numberOfPastriesWin)
        if (isNaN(numberOfPastriesWin) || numberOfPastriesWin === 0) {
            return res.status(500).json({message: "Vous avez perdu"});
        }

        let pastriesAvailable = await getAvailablePastries();
        if (pastriesAvailable.length === 0) {
            return res.status(400).json({message: "Aucune pâtisserie disponible."});
        }

        let i = 1;
        let initialNumber = 3;
        let pastries = await findRandomPastries(i);
        let awardedPastries = [];

        while (initialNumber > 0 && pastriesAvailable.length > 0) {
            if (pastries.length > 0) {
                awardedPastries.push(pastries[0]);
                await Pastry.findByIdAndUpdate(pastries[0]._id, {$inc: {number: -1}});
                initialNumber--;
            }

            if (initialNumber > 0) {
                pastries = await findRandomPastries(i);
            }

            pastriesAvailable = await getAvailablePastries();
        }

        if (awardedPastries.length === 0) {
            return res.status(500).json({message: "Erreur lors de la récupération des pâtisseries."});
        }

        const response = awardedPastries.map((pastry, index) => ({
            [`pastriesName${index + 1}`]: pastry.name,
            [`pastriesNumber${index + 1}`]: 1
        }));
        console.log(response)

        res.json({
            pastries: response,
            totalAwarded: awardedPastries.length
        });



    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Erreur lors de la récupération des pâtisseries"});
    }
};

async function findRandomPastries(requiredCount) {
    return Pastry.aggregate([
        {$match: {number: {$gte: requiredCount}}},
        {$sample: {size: requiredCount}}
    ]);
}

async function getAvailablePastries() {
    try {
        const pastries = await Pastry.find({number: {$gt: 0}});
        console.log("pastries fetched:", pastries);
        return pastries;
    } catch (err) {
        console.error("Failed to retrieve pastries:", err);
        throw err;
    }
}
