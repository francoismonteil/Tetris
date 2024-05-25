import { Tetromino } from './tetromino.js';

export class GameState {
    constructor() {
        this.gameState = {};
        this.isLocked = false;
        this.isGameStarted = false;
        this.dropInterval = 1000;
        this.dropTimeout = null;
    }

    async fetchInitialGameState() {
        try {
            const response = await fetch('/gameState');
            const newGameState = await response.json();
            this.initializeTetromino(newGameState);
            this.updateGameState(newGameState);
        } catch (error) {
            console.error("Error loading initial game state:", error);
        }
    }

    initializeTetromino(state) {
        if (state.currentTetromino) {
            state.currentTetromino = new Tetromino(
                state.currentTetromino.type,
                state.currentTetromino.shape,
                state.currentTetromino.x,
                state.currentTetromino.y
            );
        }
    }

    updateGameState(newGameState) {
        this.initializeTetromino(newGameState);
        this.gameState = newGameState;
        this.isLocked = false;
        this.updateUI(newGameState);
        if (newGameState.gameOver) {
            this.handleGameOver();
        } else {
            this.resetDropInterval(newGameState.level);
        }
    }

    async sendAction(action, sound) {
        try {
            const response = await fetch(action, { method: 'POST' });
            if (response.ok) {
                const newGameState = await response.json();
                this.initializeTetromino(newGameState);
                if (sound) sound.play();
                this.updateGameState(newGameState);
            }
        } catch (error) {
            console.error("Error sending action:", error);
        }
    }

    checkCollision(tetromino, board) {
        return tetromino.shape.some((row, i) =>
            row.some((cell, j) => {
                if (cell !== 0) {
                    const newX = tetromino.x + j;
                    const newY = tetromino.y + i;
                    return (
                        newX < 0 ||
                        newX >= board[0].length ||
                        newY >= board.length ||
                        (board[newY] && board[newY][newX] !== 0)
                    );
                }
                return false;
            })
        );
    }

    lockTetromino(tetromino, board) {
        tetromino.shape.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell !== 0) {
                    board[tetromino.y + i][tetromino.x + j] = cell;
                }
            });
        });
    }

    resetDropInterval(level) {
        clearTimeout(this.dropTimeout);
        this.dropInterval = Math.max(1000 - (level - 1) * 100, 100);
        this.dropTimeout = setTimeout(() => this.dropPiece(), this.dropInterval);
    }

    handleGameOver() {
        clearTimeout(this.dropTimeout);
    }

    updateUI(state) {
        const scoreElem = document.getElementById('score');
        const levelElem = document.getElementById('level');
        const controlsElem = document.getElementById('controls');
        const gameOverElem = document.getElementById('game-over');

        scoreElem.textContent = state.score;
        levelElem.textContent = state.level;
        controlsElem.style.display = state.gameOver ? 'none' : 'block';
        gameOverElem.style.display = state.gameOver ? 'block' : 'none';
    }

    dropPiece() {
        if (!this.isLocked && this.gameState.currentTetromino) {
            window.moveDown();
        }
        this.dropTimeout = setTimeout(() => this.dropPiece(), this.dropInterval);
    }
}
