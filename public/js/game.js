document.getElementById('play').addEventListener('click', async () => {
    try {
        const responseUser = await fetch('/play-game', { method: 'POST' });
        const dataUser = await responseUser.json();
        if (responseUser.ok) {
            console.log(dataUser);
            document.getElementById('chance').textContent = `Chance: ${dataUser.chanceCount}`;
            const diceResults = game();
            console.log(diceResults);
            const pastriesWin = diceResults.prize || 0;
            const responsePastrie = await fetch(`/game/win/pastries=${pastriesWin}`, { method: 'POST' });
            const dataPastries = await responsePastrie.json();

            const diceElements = document.querySelectorAll('#dice-results li');
            for (let i = 0; i < diceResults.results.length; i++) {
                await new Promise(resolve => setTimeout(resolve, 200));
                console.log(diceElements[i]);
                diceElements[i].textContent = `Dé ${i + 1}: ${diceResults.results[i]}`;
            }

            console.log(dataPastries);
            let resultMessage = 'Désolé, vous avez perdu.';
            if (diceResults.win) {
                if (Array.isArray(dataPastries.pastries) && dataPastries.pastries.length > 0) {
                    let prizeNames = dataPastries.pastries[0] + (dataPastries.pastries[1] || '') + (dataPastries.pastries[2] || '');
                    resultMessage = `Félicitations, vous avez gagné! Prix: ${dataPastries.totalAwarded} pâtisseries: ${prizeNames}`;
                } else {
                    resultMessage = 'Félicitations, vous avez gagné, mais il n\'y a pas assez de pâtisseries disponibles.';
                }
            }
            document.getElementById('game-result').textContent = resultMessage;
        } else {
            document.getElementById('game-result').textContent = 'Erreur : ' + dataUser.message;
        }
    } catch (error) {
        console.error('Erreur lors de la requête:', error);
    }
});

function game() {
    const result = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
    const counts = result.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
    }, {});

    const pairs = Object.values(counts).filter(count => count === 2).length;
    const quads = Object.values(counts).some(count => count === 4);
    const yams = Object.values(counts).some(count => count === 5);

    if (yams) return { win: true, prize: 3, results: result };
    if (quads) return { win: true, prize: 2, results: result };
    if (pairs === 2) return { win: true, prize: 1, results: result };
    return { win: false, results: result };
}
