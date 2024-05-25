class Tetromino {
    constructor(type, shape, x, y) {
        this.type = type;
        this.shape = shape;
        this.x = x;
        this.y = y;
    }

    rotate() {
        const newShape = [];
        for (let y = 0; y < this.shape.length; y++) {
            newShape[y] = [];
            for (let x = 0; x < this.shape[y].length; x++) {
                newShape[y][x] = this.shape[this.shape.length - 1 - x][y];
            }
        }
        this.shape = newShape;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('game-board');
    const context = canvas.getContext('2d');
    const blockSize = 30;

    const moveSound = new Audio('/sounds/move.mp3');
    const rotateSound = new Audio('/sounds/rotate.mp3');
    const lineClearSound = new Audio('/sounds/line-clear.mp3');
    const backgroundMusic = new Audio('/sounds/background.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.play();

    const images = {};
    const pieceTypes = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

    let imagesLoaded = 0;
    let allImagesLoaded = false;
    let isGameStarted = false;

    function fetchInitialGameState() {
        fetch('/gameState')
            .then(response => response.json())
            .then(newGameState => {
                initializeTetromino(newGameState);
                updateGameState(newGameState);
            })
            .catch(error => console.error("Error loading initial game state:", error));
    }

    pieceTypes.forEach(type => {
        const img = new Image();
        img.src = `/images/${type}.png`;
        img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === pieceTypes.length) {
                allImagesLoaded = true;
            }
        };
        images[type] = img;
    });

    let dropInterval = 1000;
    let dropTimeout;
    let gameState = {};
    let isLocked = false;

    function initializeTetromino(gameState) {
        if (gameState.currentTetromino) {
            gameState.currentTetromino = new Tetromino(
                gameState.currentTetromino.type,
                gameState.currentTetromino.shape,
                gameState.currentTetromino.x,
                gameState.currentTetromino.y
            );
        }
    }

    function drawBoard(board, tetromino) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (let y = 0; y < board.length; y++) {
            for (let x = 0; x < board[y].length; x++) {
                if (board[y][x] !== 0) {
                    context.fillStyle = 'gray';
                    context.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
                    context.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
                }
            }
        }

        if (tetromino && allImagesLoaded) {
            const shape = tetromino.shape;
            const type = tetromino.type;
            const posX = tetromino.x;
            const posY = tetromino.y;

            for (let i = 0; i < shape.length; i++) {
                for (let j = 0; j < shape[i].length; j++) {
                    if (shape[i][j] !== 0) {
                        const img = images[type];
                        if (img) {
                            context.drawImage(img, (posX + j) * blockSize, (posY + i) * blockSize, blockSize, blockSize);
                        } else {
                            console.error(`Image for type ${type} not found`);
                        }
                    }
                }
            }
        }
    }

    function updateGameState(newGameState) {
        initializeTetromino(newGameState);
        gameState = newGameState;
        isLocked = false;
        drawBoard(gameState.gameBoard, gameState.currentTetromino);

        const scoreElem = document.getElementById('score');
        const levelElem = document.getElementById('level');
        const controlsElem = document.getElementById('controls');
        const gameOverElem = document.getElementById('game-over');

        if (scoreElem) {
            scoreElem.textContent = gameState.score;
        }

        if (levelElem) {
            levelElem.textContent = gameState.level;
        }

        if (gameState.gameOver) {
            if (controlsElem) {
                controlsElem.style.display = 'none';
            }
            if (gameOverElem) {
                gameOverElem.style.display = 'block';
            }
            clearTimeout(dropTimeout);
        } else {
            if (controlsElem) {
                controlsElem.style.display = 'block';
            }
            if (gameOverElem) {
                gameOverElem.style.display = 'none';
            }
            resetDropInterval(gameState.level);
        }
    }

    async function sendAction(action, sound) {
        try {
            const response = await fetch(action, { method: 'POST' });
            if (response.ok) {
                const newGameState = await response.json();
                initializeTetromino(newGameState);
                if (sound) {
                    sound.play();
                }
                updateGameState(newGameState);
            }
        } catch (error) {
            console.error("Error sending action:", error);
        }
    }

    function checkCollision(tetromino, board) {
        const { shape, x, y } = tetromino;

        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
                if (shape[i][j] !== 0) {
                    const newX = x + j;
                    const newY = y + i;
                    if (
                        newX < 0 ||
                        newX >= board[0].length ||
                        newY >= board.length ||
                        (board[newY] && board[newY][newX] !== 0)
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function lockTetromino(tetromino, board) {
        const { shape, x, y } = tetromino;

        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
                if (shape[i][j] !== 0) {
                    board[y + i][x + j] = shape[i][j];
                }
            }
        }
    }

    function animateTetromino(tetromino, targetX, targetY, duration, callback) {
        const startX = tetromino.x;
        const startY = tetromino.y;
        const deltaX = targetX - startX;
        const deltaY = targetY - startY;
        const startTime = Date.now();

        function animate() {
            const currentTime = Date.now();
            const elapsedTime = currentTime - startTime;
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
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            toggleMusicButton.textContent = 'Mute Music';
        } else {
            backgroundMusic.pause();
            toggleMusicButton.textContent = 'Unmute Music';
        }
    };

    window.moveDown = async function() {
        if (isLocked || !isGameStarted) return;
        if (!gameState.currentTetromino) return;
        const targetY = gameState.currentTetromino.y + 1;
        if (!checkCollision({ ...gameState.currentTetromino, y: targetY }, gameState.gameBoard)) {
            gameState.currentTetromino.y = targetY;
            drawBoard(gameState.gameBoard, gameState.currentTetromino);
            await sendAction('/moveDown', moveSound);
        } else {
            lockTetromino(gameState.currentTetromino, gameState.gameBoard);
            isLocked = true;
            await sendAction('/lock', null);
        }
    };

    window.moveLeft = async function() {
        if (isLocked || !isGameStarted) return;
        if (!gameState.currentTetromino) return;
        const targetX = gameState.currentTetromino.x - 1;
        if (!checkCollision({ ...gameState.currentTetromino, x: targetX }, gameState.gameBoard)) {
            gameState.currentTetromino.x = targetX;
            drawBoard(gameState.gameBoard, gameState.currentTetromino);
            await sendAction('/moveLeft', moveSound);
        }
    };

    window.moveRight = async function() {
        if (isLocked || !isGameStarted) return;
        if (!gameState.currentTetromino) return;
        const targetX = gameState.currentTetromino.x + 1;
        if (!checkCollision({ ...gameState.currentTetromino, x: targetX }, gameState.gameBoard)) {
            gameState.currentTetromino.x = targetX;
            drawBoard(gameState.gameBoard, gameState.currentTetromino);
            await sendAction('/moveRight', moveSound);
        }
    };

    window.rotate = async function() {
        if (isLocked || !isGameStarted) return;
        if (!gameState.currentTetromino) return;
        const originalShape = gameState.currentTetromino.shape;
        gameState.currentTetromino.rotate();
        if (checkCollision(gameState.currentTetromino, gameState.gameBoard)) {
            gameState.currentTetromino.shape = originalShape;
        }
        drawBoard(gameState.gameBoard, gameState.currentTetromino);
        await sendAction('/rotate', rotateSound);
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
        const gameOverElem = document.getElementById('game-over');
        if (gameOverElem && gameOverElem.style.display === 'block') {
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
});
