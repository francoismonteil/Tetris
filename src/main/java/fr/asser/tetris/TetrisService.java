// src/main/java/fr/asser/tetris/TetrisService.java
package fr.asser.tetris;

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

    public void moveTetrominoDown() {
        if (!moveTetromino(currentTetromino.getX(), currentTetromino.getY() + 1)) {
            lockTetromino();
            clearLines();
            generateNewTetromino();
        }
    }

    public void moveTetrominoLeft() {
        moveTetromino(currentTetromino.getX() - 1, currentTetromino.getY());
    }

    public void moveTetrominoRight() {
        moveTetromino(currentTetromino.getX() + 1, currentTetromino.getY());
    }

    public void rotateTetromino() {
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
        gameBoard.placeTetromino(currentTetromino);

        if (currentTetromino.getY() < 0) {
            gameOver = true;
        }
    }

    public void clearLines() {
        gameBoard.clearLines();
    }

    public void generateNewTetromino() {
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
