package fr.asser.tetris.service;

import fr.asser.tetris.model.GameBoard;
import fr.asser.tetris.model.Tetromino;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class TetrisService {

    private static final Logger logger = LoggerFactory.getLogger(TetrisService.class);

    private GameBoard gameBoard;
    private Tetromino currentTetromino;
    private boolean gameOver;

    public TetrisService() {
        restartGame();
    }

    public GameBoard getGameBoard() {
        return gameBoard;
    }

    public Tetromino getCurrentTetromino() {
        return currentTetromino;
    }

    public boolean isGameOver() {
        return gameOver;
    }

    public void setGameBoard(GameBoard gameBoard) {
        this.gameBoard = gameBoard;
    }

    public void setCurrentTetromino(Tetromino currentTetromino) {
        this.currentTetromino = currentTetromino;
    }

    public void setGameOver(boolean gameOver) {
        this.gameOver = gameOver;
    }

    public void moveTetrominoDown() {
        logger.info("Moving tetromino down");
        if (!moveTetromino(currentTetromino.getX(), currentTetromino.getY() + 1)) {
            lockTetromino();
            clearLines();
            generateNewTetromino();
        }
    }

    public void moveTetrominoLeft() {
        logger.info("Moving tetromino left");
        moveTetromino(currentTetromino.getX() - 1, currentTetromino.getY());
    }

    public void moveTetrominoRight() {
        logger.info("Moving tetromino right");
        moveTetromino(currentTetromino.getX() + 1, currentTetromino.getY());
    }

    public void rotateTetromino() {
        logger.info("Rotating tetromino");
        currentTetromino.rotate();
        if (checkCollision(currentTetromino.getX(), currentTetromino.getY())) {
            currentTetromino.rotateBack();
        }
    }

    private boolean moveTetromino(int newX, int newY) {
        if (!checkCollision(newX, newY)) {
            currentTetromino.setX(newX);
            currentTetromino.setY(newY);
            return true;
        }
        return false;
    }

    public void lockTetromino() {
        logger.info("Locking tetromino");
        gameBoard.placeTetromino(currentTetromino);

        if (currentTetromino.getY() < 0) {
            gameOver = true;
        }
    }

    public void clearLines() {
        logger.info("Clearing lines");
        gameBoard.clearLines();
    }

    public void generateNewTetromino() {
        logger.info("Generating new tetromino");
        currentTetromino = new Tetromino();
        if (checkCollision(currentTetromino.getX(), currentTetromino.getY())) {
            gameOver = true;
        }
    }

    public boolean checkCollision(int x, int y) {
        return !gameBoard.canPlaceTetromino(new TetrominoWrapper(currentTetromino, x, y));
    }

    public void restartGame() {
        logger.info("Restarting game");
        gameBoard = new GameBoard();
        currentTetromino = new Tetromino();
        gameOver = false;
    }

    private static class TetrominoWrapper extends Tetromino {
        TetrominoWrapper(Tetromino tetromino, int x, int y) {
            super();
            this.setX(x);
            this.setY(y);
            this.shape = tetromino.getShape();
            this.type = tetromino.getType();
        }
    }
}
