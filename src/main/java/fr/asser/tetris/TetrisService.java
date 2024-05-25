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
        int[][] shape = currentTetromino.getShape();
        int x = currentTetromino.getX();
        int y = currentTetromino.getY();

        for (int i = 0; i < shape.length; i++) {
            for (int j = 0; j < shape[i].length; j++) {
                if (shape[i][j] != 0) {
                    gameBoard.getBoard()[y + i][x + j] = shape[i][j];
                }
            }
        }

        if (y < 0) {
            gameOver = true;
        }
    }

    public void clearLines() {
        int[][] board = gameBoard.getBoard();
        for (int i = 0; i < board.length; i++) {
            if (isLineComplete(board[i])) {
                clearLine(i);
            }
        }
    }

    private boolean isLineComplete(int[] line) {
        for (int cell : line) {
            if (cell == 0) {
                return false;
            }
        }
        return true;
    }

    private void clearLine(int lineIndex) {
        int[][] board = gameBoard.getBoard();
        for (int k = lineIndex; k > 0; k--) {
            board[k] = board[k - 1];
        }
        board[0] = new int[board[0].length];
    }

    public void generateNewTetromino() {
        currentTetromino = new Tetromino();
        if (checkCollision(currentTetromino.getX(), currentTetromino.getY())) {
            gameOver = true;
        }
    }

    public boolean checkCollision(int x, int y) {
        int[][] shape = currentTetromino.getShape();
        for (int i = 0; i < shape.length; i++) {
            for (int j = 0; j < shape[i].length; j++) {
                if (shape[i][j] != 0) {
                    int newX = x + j;
                    int newY = y + i;
                    if (isOutOfBounds(newX, newY) || isOccupied(newX, newY)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private boolean isOutOfBounds(int x, int y) {
        return x < 0 || x >= gameBoard.getBoard()[0].length || y >= gameBoard.getBoard().length;
    }

    private boolean isOccupied(int x, int y) {
        return y >= 0 && gameBoard.getBoard()[y][x] != 0;
    }

    public void restartGame() {
        logger.info("Restarting game");
        gameBoard = new GameBoard();
        currentTetromino = new Tetromino();
        gameOver = false;
    }
}
