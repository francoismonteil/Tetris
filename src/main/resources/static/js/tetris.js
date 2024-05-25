class Tetromino {
    constructor(type, shape, x, y) {
        this.type = type;
        this.shape = shape;
        this.x = x;
        this.y = y;
    }

    rotate() {
        this.shape = this.shape[0].map((val, index) =>
            this.shape.map(row => row[index]).reverse()
        );
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('game-board');
    const context = canvas.getContext('2d');
    const blockSize = 30;
    const sounds = {
        move: new Audio('/sounds/move.mp3'),
        rotate: new Audio('/sounds/rotate.mp3'),
        lineClear: new Audio('/sounds/line-clear.mp3'),
        backgroundMusic: new Audio('/sounds/background.mp3'),
    };
    sounds.backgroundMusic.loop = true;
    sounds.backgroundMusic.play();

    const images = {};
    const pieceTypes = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    let imagesLoaded = 0;
    let isGameStarted = false;
    let dropInterval = 1000;
    let dropTimeout;
    let gameState = {};
    let isLocked = false;

    function preloadImages() {
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

    function fetchInitialGameState() {
        fetch('/gameState')
            .then(response => response.json())
            .then(newGameState => {
                initializeTetromino(newGameState);
                updateGameState(newGameState);
            })
            .catch(error => console.error("Error loading initial game state:", error));
    }

    function initializeTetromino(state) {
        if (state.currentTetromino) {
            state.currentTetromino = new Tetromino(
                state.currentTetromino.type,
                state.currentTetromino.shape,
                state.currentTetromino.x,
                state.currentTetromino.y
            );
        }
    }

    function drawBoard(board, tetromino) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        board.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell !== 0) {
                    context.fillStyle = 'gray';
                    context.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
                    context.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
                }
            });
        });
        if (tetromino) {
            drawTetromino(tetromino);
        }
    }

    function drawTetromino(tetromino) {
        const { shape, type, x, y } = tetromino;
        shape.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell !== 0) {
                    const img = images[type];
                    context.drawImage(img, (x + j) * blockSize, (y + i) * blockSize, blockSize, blockSize);
                }
            });
        });
    }

    function updateGameState(newGameState) {
        initializeTetromino(newGameState);
        gameState = newGameState;
        isLocked = false;
        drawBoard(gameState.gameBoard, gameState.currentTetromino);
        updateUI(newGameState);
        if (gameState.gameOver) {
            handleGameOver();
        } else {
            resetDropInterval(gameState.level);
        }
    }

    function updateUI(state) {
        const scoreElem = document.getElementById('score');
        const levelElem = document.getElementById('level');
        const controlsElem = document.getElementById('controls');
        const gameOverElem = document.getElementById('game-over');

        scoreElem.textContent = state.score;
        levelElem.textContent = state.level;
        controlsElem.style.display = state.gameOver ? 'none' : 'block';
        gameOverElem.style.display = state.gameOver ? 'block' : 'none';
    }

    function handleGameOver() {
        clearTimeout(dropTimeout);
    }

    async function sendAction(action, sound) {
        try {
            const response = await fetch(action, { method: 'POST' });
            if (response.ok) {
                const newGameState = await response.json();
                initializeTetromino(newGameState);
                if (sound) sound.play();
                updateGameState(newGameState);
            }
        } catch (error) {
            console.error("Error sending action:", error);
        }
    }

    function checkCollision(tetromino, board) {
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

    function lockTetromino(tetromino, board) {
        tetromino.shape.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell !== 0) {
                    board[tetromino.y + i][tetromino.x + j] = cell;
                }
            });
        });
    }

    function animateTetromino(tetromino, targetX, targetY, duration, callback) {
        const startX = tetromino.x;
        const startY = tetromino.y;
        const deltaX = targetX - startX;
        const deltaY = targetY - startY;
        const startTime = Date.now();

        function animate() {
            const elapsedTime = Date.now() - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            tetromino.x = startX + deltaX * progress;
            tetromino.y = startY + deltaY * progress;

            drawBoard(gameState.gameBoard, tetromino);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                tetromino.x = targetX;
                tetromino.y = targetY;
                if (callback) callback();
            }
        }

        requestAnimationFrame(animate);
    }

    window.toggleMusic = function() {
        const toggleMusicButton = document.getElementById('toggle-music');
        if (sounds.backgroundMusic.paused) {
            sounds.backgroundMusic.play();
            toggleMusicButton.textContent = 'Mute Music';
        } else {
            sounds.backgroundMusic.pause();
            toggleMusicButton.textContent = 'Unmute Music';
        }
    };

    window.moveDown = async function() {
        if (isLocked || !isGameStarted || !gameState.currentTetromino) return;
        const targetY = gameState.currentTetromino.y + 1;
        if (!checkCollision({ ...gameState.currentTetromino, y: targetY }, gameState.gameBoard)) {
            gameState.currentTetromino.y = targetY;
            drawBoard(gameState.gameBoard, gameState.currentTetromino);
            await sendAction('/moveDown', sounds.move);
        } else {
            lockTetromino(gameState.currentTetromino, gameState.gameBoard);
            isLocked = true;
            await sendAction('/lock');
        }
    };

    window.moveLeft = async function() {
        if (isLocked || !isGameStarted || !gameState.currentTetromino) return;
        const targetX = gameState.currentTetromino.x - 1;
        if (!checkCollision({ ...gameState.currentTetromino, x: targetX }, gameState.gameBoard)) {
            gameState.currentTetromino.x = targetX;
            drawBoard(gameState.gameBoard, gameState.currentTetromino);
            await sendAction('/moveLeft', sounds.move);
        }
    };

    window.moveRight = async function() {
        if (isLocked || !isGameStarted || !gameState.currentTetromino) return;
        const targetX = gameState.currentTetromino.x + 1;
        if (!checkCollision({ ...gameState.currentTetromino, x: targetX }, gameState.gameBoard)) {
            gameState.currentTetromino.x = targetX;
            drawBoard(gameState.gameBoard, gameState.currentTetromino);
            await sendAction('/moveRight', sounds.move);
        }
    };

    window.rotate = async function() {
        if (isLocked || !isGameStarted || !gameState.currentTetromino) return;
        const originalShape = gameState.currentTetromino.shape;
        gameState.currentTetromino.rotate();
        if (checkCollision(gameState.currentTetromino, gameState.gameBoard)) {
            gameState.currentTetromino.shape = originalShape;
        }
        drawBoard(gameState.gameBoard, gameState.currentTetromino);
        await sendAction('/rotate', sounds.rotate);
    };

    function dropPiece() {
        if (!isLocked && gameState.currentTetromino) {
            window.moveDown();
        }
        dropTimeout = setTimeout(dropPiece, dropInterval);
    }

    function resetDropInterval(level) {
        clearTimeout(dropTimeout);
        dropInterval = Math.max(1000 - (level - 1) * 100, 100);
        dropTimeout = setTimeout(dropPiece, dropInterval);
    }

    document.addEventListener("keydown", function(event) {
        if (document.getElementById('game-over').style.display === 'block') {
            return;
        }

        switch (event.key) {
            case "ArrowDown":
                moveDown();
                break;
            case "ArrowLeft":
                moveLeft();
                break;
            case "ArrowRight":
                moveRight();
                break;
            case "ArrowUp":
                rotate();
                break;
        }
    });

    window.startGame = function() {
        if (!isGameStarted) {
            isGameStarted = true;
            document.getElementById('start-screen').style.display = 'none';
            document.getElementById('game-container').style.display = 'block';
            fetchInitialGameState();
            dropPiece();
        }
    };

    preloadImages().then(fetchInitialGameState).catch(error => {
        console.error("Error loading images:", error);
    });
});
