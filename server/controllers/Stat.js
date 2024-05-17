import Stat from '../models/Stat.js';

export const getStat = async (req, res, next) => {
    try {
        const stats = await Stat.find();
        req.stats = stats;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de la récupération des statistiques");
    }
};

export const sendStat = async (req,res) => {
    const stats = req.stats

    stats.winAt = formatDateForDisplay(stats.winAt)

    res.render('pages/stat', {winners: stats})
}


function formatDateForDisplay(date) {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    return new Date(date).toLocaleString('fr-FR', options).replace(',', '');
}