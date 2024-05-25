// src/main/resources/static/js/tetris.js
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
    let allImagesLoaded = false; // Indicateur pour vérifier si toutes les images sont chargées

    pieceTypes.forEach(type => {
        const img = new Image();
        img.src = `/images/${type}.png`;
        img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === pieceTypes.length) {
                allImagesLoaded = true; // Toutes les images sont chargées
                fetchInitialGameState();
            }
        };
        images[type] = img;
    });

    let dropInterval = 1000; // Intervalle de descente par défaut en millisecondes
    let dropTimeout;
    let gameState = {}; // Stocker l'état du jeu globalement
    let isLocked = false; // Indicateur de verrouillage du tétrimino

    function drawBoard(board, tetromino) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Dessiner le plateau
        for (let y = 0; y < board.length; y++) {
            for (let x = 0; x < board[y].length; x++) {
                if (board[y][x] !== 0) {
                    context.fillStyle = 'gray';
                    context.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
                    context.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
                }
            }
        }

        // Dessiner la pièce courante
        if (tetromino && allImagesLoaded) { // Vérifier si toutes les images sont chargées
            const shape = tetromino.shape;
            const type = tetromino.type;
            const posX = tetromino.x;
            const posY = tetromino.y;

            for (let i = 0; i < shape.length; i++) {
                for (let j = 0; j < shape[i].length; j++) {
                    if (shape[i][j] !== 0) {
                        const img = images[type];
                        if (img) { // Vérifiez que l'image existe avant de l'utiliser
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
        gameState = newGameState;
        isLocked = false; // Réinitialiser l'indicateur de verrouillage
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
                if (sound) {
                    sound.play();
                }
                updateGameState(newGameState);
            }
        } catch (error) {
            console.error("Error sending action:", error);
        }
    }

    function fetchInitialGameState() {
        fetch('/gameState')
            .then(response => response.json())
            .then(updateGameState)
            .catch(error => console.error("Error loading initial game state:", error));
    }

    function checkCollision(tetromino, board) {
        const { shape, x, y } = tetromino;

        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
                if (shape[i][j] !== 0) {
                    const newX = x + j;
                    const newY = y + i;
                    if (
                        newX < 0 || // Collision avec le mur gauche
                        newX >= board[0].length || // Collision avec le mur droit
                        newY >= board.length || // Collision avec le bas
                        (board[newY] && board[newY][newX] !== 0) // Collision avec un autre bloc
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

    // Fonction pour couper ou réactiver la musique de fond
    window.toggleMusic = function() {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            document.getElementById('toggle-music').textContent = 'Mute Music';
        } else {
            backgroundMusic.pause();
            document.getElementById('toggle-music').textContent = 'Unmute Music';
        }
    };

    // Définir les fonctions dans le contexte global
    window.moveDown = function() {
        if (isLocked) return;
        const targetY = gameState.currentTetromino.y + 1;
        if (!checkCollision({ ...gameState.currentTetromino, y: targetY }, gameState.gameBoard)) {
            animateTetromino(gameState.currentTetromino, gameState.currentTetromino.x, targetY, 100, () => {
                sendAction('/moveDown', moveSound);
            });
        } else {
            // Verrouiller la pièce si elle atteint le bas ou un autre bloc
            lockTetromino(gameState.currentTetromino, gameState.gameBoard);
            isLocked = true;
            sendAction('/lock', null);
        }
    };

    window.moveLeft = function() {
        if (isLocked) return;
        const targetX = gameState.currentTetromino.x - 1;
        if (!checkCollision({ ...gameState.currentTetromino, x: targetX }, gameState.gameBoard)) {
            animateTetromino(gameState.currentTetromino, targetX, gameState.currentTetromino.y, 100, () => {
                sendAction('/moveLeft', moveSound);
            });
        }
    };

    window.moveRight = function() {
        if (isLocked) return;
        const targetX = gameState.currentTetromino.x + 1;
        if (!checkCollision({ ...gameState.currentTetromino, x: targetX }, gameState.gameBoard)) {
            animateTetromino(gameState.currentTetromino, targetX, gameState.currentTetromino.y, 100, () => {
                sendAction('/moveRight', moveSound);
            });
        }
    };

    window.rotate = function() {
        if (isLocked) return;
        // Vérifier les collisions pour la rotation ici si nécessaire
        sendAction('/rotate', rotateSound);
    };

    function dropPiece() {
        moveDown();
        dropTimeout = setTimeout(dropPiece, dropInterval);
    }

    function resetDropInterval(level) {
        clearTimeout(dropTimeout);
        dropInterval = Math.max(1000 - (level - 1) * 100, 100); // Ajuster l'intervalle de descente
        dropTimeout = setTimeout(dropPiece, dropInterval);
    }

    document.addEventListener("keydown", function(event) {
        const gameOverElem = document.getElementById('game-over');
        if (gameOverElem && gameOverElem.style.display === 'block') {
            return; // Ne rien faire si le jeu est terminé
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

    // Charger l'état initial du jeu
    fetchInitialGameState();
});
