import { GameState } from './gameState.js';
import { Renderer } from './renderer.js';
import { Controls } from './controls.js';

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
                img.onload = resolve;
                img.onerror = reject;
                images[type] = img;
            });
        }));
    }

    await preloadImages();

    const gameState = new GameState();
    gameState.isPaused = false;
    const renderer = new Renderer(canvasId, images, blockSize);
    const controls = new Controls(gameState, sounds);

    gameState.updateGameState = function(newGameState) {
        this.initializeTetromino(newGameState);
        this.gameState = newGameState;
        this.isLocked = false;
        renderer.drawBoard(this.gameState.gameBoard, this.gameState.currentTetromino);
        this.updateUI(newGameState);
        if (newGameState.gameOver) {
            this.handleGameOver();
        } else {
            this.resetDropInterval(newGameState.level);
        }
    };

    controls.setupEventListeners();

    window.startGame = function() {
        if (!gameState.isGameStarted) {
            gameState.isGameStarted = true;
            document.getElementById('start-screen').style.display = 'none';
            document.getElementById('game-container').style.display = 'block';
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
});
