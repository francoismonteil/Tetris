export class Renderer {
    constructor(canvasId, images, blockSize) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.images = images;
        this.blockSize = blockSize;
        this.nextPieceCanvas = document.getElementById('next-piece');
        this.nextPieceContext = this.nextPieceCanvas.getContext('2d');
    }

    drawBoard(board, tetromino) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        board.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell !== 0) {
                    this.context.fillStyle = 'gray';
                    this.context.fillRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
                    this.context.strokeRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
                }
            });
        });
        if (tetromino) {
            this.drawTetromino(tetromino);
        }
    }

    drawTetromino(tetromino) {
        const { shape, type, x, y } = tetromino;
        shape.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell !== 0) {
                    const img = this.images[type];
                    this.context.drawImage(img, (x + j) * this.blockSize, (y + i) * this.blockSize, this.blockSize, this.blockSize);
                }
            });
        });
    }

    drawNextPiece(tetromino) {
        this.nextPieceContext.clearRect(0, 0, this.nextPieceCanvas.width, this.nextPieceCanvas.height);
        const { shape, type } = tetromino;
        shape.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell !== 0) {
                    const img = this.images[type];
                    this.nextPieceContext.drawImage(img, j * this.blockSize, i * this.blockSize, this.blockSize, this.blockSize);
                }
            });
        });
    }
}
