import { GameState } from './gameState.js';

export class Controls {
    constructor(gameState, sounds) {
        this.gameState = gameState;
        this.sounds = sounds;
    }

    setupEventListeners() {
        document.addEventListener("keydown", (event) => {
            if (document.getElementById('game-over').style.display === 'block') {
                return;
            }

            switch (event.key) {
                case "ArrowDown":
                    this.moveDown();
                    break;
                case "ArrowLeft":
                    this.moveLeft();
                    break;
                case "ArrowRight":
                    this.moveRight();
                    break;
                case "ArrowUp":
                    this.rotate();
                    break;
            }
        });

        document.getElementById('toggle-music').addEventListener('click', this.toggleMusic.bind(this));
    }

    async moveDown() {
        if (this.gameState.isLocked || !this.gameState.isGameStarted || !this.gameState.gameState.currentTetromino) return;
        const targetY = this.gameState.gameState.currentTetromino.y + 1;
        if (!this.gameState.checkCollision({ ...this.gameState.gameState.currentTetromino, y: targetY }, this.gameState.gameState.gameBoard)) {
            this.gameState.gameState.currentTetromino.y = targetY;
            this.gameState.updateGameState(this.gameState.gameState);
            await this.gameState.sendAction('/moveDown', this.sounds.move);
        } else {
            this.gameState.lockTetromino(this.gameState.gameState.currentTetromino, this.gameState.gameState.gameBoard);
            this.gameState.isLocked = true;
            await this.gameState.sendAction('/lock');
        }
    }

    async moveLeft() {
        if (this.gameState.isLocked || !this.gameState.isGameStarted || !this.gameState.gameState.currentTetromino) return;
        const targetX = this.gameState.gameState.currentTetromino.x - 1;
        if (!this.gameState.checkCollision({ ...this.gameState.gameState.currentTetromino, x: targetX }, this.gameState.gameState.gameBoard)) {
            this.gameState.gameState.currentTetromino.x = targetX;
            this.gameState.updateGameState(this.gameState.gameState);
            await this.gameState.sendAction('/moveLeft', this.sounds.move);
        }
    }

    async moveRight() {
        if (this.gameState.isLocked || !this.gameState.isGameStarted || !this.gameState.gameState.currentTetromino) return;
        const targetX = this.gameState.gameState.currentTetromino.x + 1;
        if (!this.gameState.checkCollision({ ...this.gameState.gameState.currentTetromino, x: targetX }, this.gameState.gameState.gameBoard)) {
            this.gameState.gameState.currentTetromino.x = targetX;
            this.gameState.updateGameState(this.gameState.gameState);
            await this.gameState.sendAction('/moveRight', this.sounds.move);
        }
    }

    async rotate() {
        if (this.gameState.isLocked || !this.gameState.isGameStarted || !this.gameState.gameState.currentTetromino) return;
        const originalShape = this.gameState.gameState.currentTetromino.shape;
        this.gameState.gameState.currentTetromino.rotate();
        if (this.gameState.checkCollision(this.gameState.gameState.currentTetromino, this.gameState.gameState.gameBoard)) {
            this.gameState.gameState.currentTetromino.shape = originalShape;
        }
        this.gameState.updateGameState(this.gameState.gameState);
        await this.gameState.sendAction('/rotate', this.sounds.rotate);
    }

    toggleMusic() {
        const toggleMusicButton = document.getElementById('toggle-music');
        if (this.sounds.backgroundMusic.paused) {
            this.sounds.backgroundMusic.play();
            toggleMusicButton.textContent = 'Mute Music';
        } else {
            this.sounds.backgroundMusic.pause();
            toggleMusicButton.textContent = 'Unmute Music';
        }
    }
}
