export class Controls {
    constructor(gameState, sounds) {
        this.gameState = gameState;
        this.sounds = sounds;
        this.isMuted = false;
    }

    setGameState(gameState) {
        this.gameState = gameState;
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
                case "p":
                case "P":
                    this.togglePause();
                    break;
                case "s":
                case "S":
                    this.saveGame();
                    break;
                case "l":
                case "L":
                    this.loadGame();
                    break;
            }
        });

        document.getElementById('toggle-music').addEventListener('click', this.toggleMusic.bind(this));
    }

    async moveDown() {
        if (this.gameState.isLocked || !this.gameState.isGameStarted || !this.gameState.gameState.currentTetromino || this.gameState.isPaused) return;
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
        if (this.gameState.isLocked || !this.gameState.isGameStarted || !this.gameState.gameState.currentTetromino || this.gameState.isPaused) return;
        const targetX = this.gameState.gameState.currentTetromino.x - 1;
        if (!this.gameState.checkCollision({ ...this.gameState.gameState.currentTetromino, x: targetX }, this.gameState.gameState.gameBoard)) {
            this.gameState.gameState.currentTetromino.x = targetX;
            this.gameState.updateGameState(this.gameState.gameState);
            await this.gameState.sendAction('/moveLeft', this.sounds.move);
        }
    }

    async moveRight() {
        if (this.gameState.isLocked || !this.gameState.isGameStarted || !this.gameState.gameState.currentTetromino || this.gameState.isPaused) return;
        const targetX = this.gameState.gameState.currentTetromino.x + 1;
        if (!this.gameState.checkCollision({ ...this.gameState.gameState.currentTetromino, x: targetX }, this.gameState.gameState.gameBoard)) {
            this.gameState.gameState.currentTetromino.x = targetX;
            this.gameState.updateGameState(this.gameState.gameState);
            await this.gameState.sendAction('/moveRight', this.sounds.move);
        }
    }

    async rotate() {
        if (this.gameState.isLocked || !this.gameState.isGameStarted || !this.gameState.gameState.currentTetromino || this.gameState.isPaused) return;
        const originalShape = this.gameState.gameState.currentTetromino.shape;
        this.gameState.gameState.currentTetromino.rotate();
        if (this.gameState.checkCollision(this.gameState.gameState.currentTetromino, this.gameState.gameState.gameBoard)) {
            this.gameState.gameState.currentTetromino.shape = originalShape;
        }
        this.gameState.updateGameState(this.gameState.gameState);
        await this.gameState.sendAction('/rotate', this.sounds.rotate);
    }

    toggleMusic() {
        this.isMuted = !this.isMuted;
        const toggleMusicButton = document.getElementById('toggle-music');
        if (this.isMuted) {
            this.sounds.backgroundMusic.pause();
            toggleMusicButton.textContent = 'Unmute Music';
        } else {
            this.sounds.backgroundMusic.play();
            toggleMusicButton.textContent = 'Mute Music';
        }
    }

    togglePause() {
        this.gameState.isPaused = !this.gameState.isPaused;
        const togglePauseButton = document.querySelector("button[onclick='togglePause()']");
        if (this.gameState.isPaused) {
            clearTimeout(this.gameState.dropTimeout);
            togglePauseButton.textContent = 'Resume';
        } else {
            this.gameState.resetDropInterval(this.gameState.gameState.level);
            togglePauseButton.textContent = 'Pause';
        }
    }

    async saveGame() {
        try {
            const response = await fetch('/save', { method: 'POST' });
            if (response.ok) {
                const savedState = await response.json();
                localStorage.setItem('tetrisGameState', JSON.stringify(savedState));
                alert('Game saved successfully!');
            }
        } catch (error) {
            console.error("Error saving game:", error);
        }
    }

    async loadGame() {
        try {
            const savedState = JSON.parse(localStorage.getItem('tetrisGameState'));
            if (savedState) {
                const response = await fetch('/load', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(savedState)
                });
                if (response.ok) {
                    const newGameState = await response.json();
                    this.gameState.updateGameState(newGameState);
                    alert('Game loaded successfully!');
                }
            } else {
                alert('No saved game found.');
            }
        } catch (error) {
            console.error("Error loading game:", error);
        }
    }
}
