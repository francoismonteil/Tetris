export async function fetchHighScores() {
    const response = await fetch('/highScores');
    if (response.ok) {
        return await response.json();
    } else {
        console.error('Failed to fetch high scores');
        return [];
    }
}

export async function submitScore(name, score) {
    const response = await fetch('/submitScore', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, score })
    });
    if (!response.ok) {
        console.error('Failed to submit score');
    }
}
