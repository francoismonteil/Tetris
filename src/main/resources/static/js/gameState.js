import { Tetromino } from './tetromino.js';

export class GameState {
    constructor() {
        this.gameState = {};
        this.isLocked = false;
        this.isGameStarted = false;
        this.dropInterval = 1000;
        this.dropCounter = 0;
        this.lastTime = 0;
        this.animationFrameId = null;
        this.isPaused = false;
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
            this.startDropInterval();
        }
    }

    updateUI(state) {
        document.getElementById('score').textContent = state.score;
        document.getElementById('level').textContent = state.level;
        document.getElementById('controls').style.display = state.gameOver ? 'none' : 'block';
        document.getElementById('game-over').style.display = state.gameOver ? 'block' : 'none';
    }

    handleGameOver() {
        cancelAnimationFrame(this.animationFrameId);
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
        this.dropInterval = Math.max(1000 - (level - 1) * 100, 100);
        if (!this.isPaused) {
            this.startDropInterval();
        }
    }

    startDropInterval() {
        const update = (time = 0) => {
            const deltaTime = time - this.lastTime;
            this.lastTime = time;
            this.dropCounter += deltaTime;

            if (this.dropCounter > this.dropInterval) {
                this.dropPiece();
                this.dropCounter = 0;
            }

            if (!this.isPaused && !this.isLocked && this.gameState.currentTetromino) {
                this.animationFrameId = requestAnimationFrame(update);
            }
        };
        this.animationFrameId = requestAnimationFrame(update);
    }

    dropPiece() {
        if (!this.isActionPrevented()) {
            window.moveDown();
        }
    }

    isActionPrevented() {
        return this.isLocked || !this.isGameStarted || !this.gameState.currentTetromino || this.isPaused;
    }
}
