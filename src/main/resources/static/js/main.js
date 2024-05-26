import { GameState } from './gameState.js';
import { Renderer } from './renderer.js';
import { Controls } from './controls.js';
import { submitScore } from './highScores.js';

document.addEventListener("DOMContentLoaded", async function() {
    const canvasId = 'game-board';
    const blockSize = 30;
    const sounds = {
        move: new Audio('/sounds/move.mp3'),
        rotate: new Audio('/sounds/rotate.mp3'),
        lineClear: new Audio('/sounds/line-clear.mp3'),
        backgroundMusic: new Audio('/sounds/background.mp3'),
    };
    sounds.backgroundMusic.loop = true;
    sounds.backgroundMusic.play();

    const pieceTypes = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    const images = {};

    async function preloadImages() {
        return Promise.all(pieceTypes.map(type => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = `/images/${type}.png`;
                img.onload = () => resolve(images[type] = img);
                img.onerror = reject;
            });
        }));
    }

    await preloadImages();

    const gameState = new GameState();
    const renderer = new Renderer(canvasId, images, blockSize);
    const controls = new Controls(gameState, sounds);

    gameState.updateGameState = function(newGameState) {
        this.initializeTetromino(newGameState);
        this.gameState = newGameState;
        this.isLocked = false;
        renderer.drawBoard(this.gameState.gameBoard, this.gameState.currentTetromino);
        renderer.drawNextPiece(this.gameState.nextTetromino);
        this.updateUI(newGameState);
        if (newGameState.gameOver) {
            this.handleGameOver();
        } else {
            this.resetDropInterval(newGameState.level);
        }
    };

    gameState.handleGameOver = async function() {
        clearTimeout(this.dropTimeout);
        document.getElementById('final-score').textContent = this.gameState.score;
        document.getElementById('high-score-modal').style.display = 'block';
    };

    controls.setupEventListeners();

    window.startGame = async function() {
        if (!gameState.isGameStarted) {
            gameState.isGameStarted = true;
            document.getElementById('start-screen').style.display = 'none';
            document.getElementById('game-container').style.display = 'block';
            await restartGame();
            gameState.fetchInitialGameState();
            gameState.dropPiece();
        }
    };

    window.moveDown = controls.moveDown.bind(controls);
    window.moveLeft = controls.moveLeft.bind(controls);
    window.moveRight = controls.moveRight.bind(controls);
    window.rotate = controls.rotate.bind(controls);
    window.toggleMusic = controls.toggleMusic.bind(controls);
    window.togglePause = controls.togglePause.bind(controls);
    window.saveGame = controls.saveGame.bind(controls);
    window.loadGame = controls.loadGame.bind(controls);

    window.restartGame = async function() {
        try {
            const response = await fetch('/restart', { method: 'POST' });
            if (response.ok) {
                const newGameState = await response.json();
                gameState.updateGameState(newGameState);
                document.getElementById('game-over').style.display = 'none';
            }
        } catch (error) {
            console.error("Error restarting game:", error);
        }
    };

    document.getElementById('toggle-music').addEventListener('click', window.toggleMusic);

    const modal = document.getElementById('high-score-modal');
    const closeBtn = document.getElementsByClassName('close')[0];

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    document.getElementById('high-score-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const playerName = document.getElementById('player-name').value;
        await submitScore(playerName, gameState.gameState.score);
        window.location.href = '/scores';
    });

    document.getElementById('back-to-game').addEventListener('click', async function() {
        await restartGame();
        window.location.href = '/';
    });
});
