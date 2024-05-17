import Pastry from "../models/Pastry.js";
import User from "../models/User.js";
import Stat from "../models/Stat.js";

export const gameInfo = async (req, res) => {
    const pastriesAvailable = await getAvailablePastries();

    res.render('pages/game', {
        winners: req.stats,
        chanceCount: req.session.user.chanceCount,
        username: req.session.user.username,
        gameStatut: pastriesAvailable.length > 0 ? 'true' : 'false'
    });


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

        if (isNaN(numberOfPastriesWin) || numberOfPastriesWin === 0) {
            return res.status(500).json({message: "Vous avez perdu"});
        }

        let pastriesAvailable = await getAvailablePastries();
        if (pastriesAvailable.length === 0) {
            return res.status(400).json({message: "Aucune pâtisserie disponible."});
        }

        let initialNumber = 3;
        let awardedPastries = [];

        while (initialNumber > 0 && pastriesAvailable.length > 0) {
            const pastries = await findRandomPastries(1);
            if (pastries.length > 0) {
                awardedPastries.push(pastries[0]);
                await Pastry.findByIdAndUpdate(pastries[0]._id, {$inc: {number: -1}});
                initialNumber--;
            }

            pastriesAvailable = await getAvailablePastries();
        }

        if (awardedPastries.length === 0) {
            return res.status(500).json({message: "Erreur lors de la récupération des pâtisseries."});
        }

        // Regrouper les pâtisseries par nom et additionner les quantités
        const aggregated = {};
        awardedPastries.forEach(pastry => {
            if (aggregated[pastry.name]) {
                aggregated[pastry.name]++;
            } else {
                aggregated[pastry.name] = 1;
            }
        });

        // Formater le résultat comme souhaité
        const response = Object.keys(aggregated).map(name => ` ${aggregated[name]} ${name}`);
        // Enregistrer les statistiques
        const stat = {
            username: req.session.user.username,
            pastries: (response[0] + (response[1] || '') + (response[2] || ''))
        };
        await createStat(req, res, stat);

        res.json({
            pastries: response,
            totalAwarded: awardedPastries.length
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Erreur lors de la récupération des pâtisseries"});
    }
};

// Fonctions auxiliaires
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

async function createStat(req, res, winnerGame) {
    try {
        const newStat = new Stat(winnerGame);
        await newStat.save();
    } catch (err) {
        console.log(err);
        res.status(500).send("Erreur lors de l'ajout des statistiques");
    }
}

