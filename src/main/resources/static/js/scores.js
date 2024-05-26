import { fetchHighScores } from './highScores.js';

document.addEventListener("DOMContentLoaded", async function() {
    const scoresTableBody = document.getElementById('scores-table').getElementsByTagName('tbody')[0];
    const highScores = await fetchHighScores();

    highScores.sort((a, b) => b.score - a.score);

    highScores.forEach((score, index) => {
        const row = scoresTableBody.insertRow();
        const rankCell = row.insertCell(0);
        const nameCell = row.insertCell(1);
        const scoreCell = row.insertCell(2);

        rankCell.textContent = index + 1;
        nameCell.textContent = score.name;
        scoreCell.textContent = score.score;
    });

    document.getElementById('back-to-game').addEventListener('click', function() {
        window.location.href = '/';
    });
});
