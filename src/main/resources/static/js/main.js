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
});
