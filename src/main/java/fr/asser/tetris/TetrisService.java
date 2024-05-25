// src/main/java/fr/asser/tetris/TetrisService.java
package fr.asser.tetris;

import fr.asser.tetris.model.GameBoard;
import fr.asser.tetris.model.Tetromino;
import org.springframework.stereotype.Service;

@Service
public class TetrisService {

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
        if (!checkCollision(currentTetromino.getX(), currentTetromino.getY() + 1)) {
            currentTetromino.setY(currentTetromino.getY() + 1);
        } else {
            lockTetromino();
            clearLines();
            generateNewTetromino();
        }
    }

    public void moveTetrominoLeft() {
        if (!checkCollision(currentTetromino.getX() - 1, currentTetromino.getY())) {
            currentTetromino.setX(currentTetromino.getX() - 1);
        }
    }

    public void moveTetrominoRight() {
        if (!checkCollision(currentTetromino.getX() + 1, currentTetromino.getY())) {
            currentTetromino.setX(currentTetromino.getX() + 1);
        }
    }

    public void rotateTetromino() {
        currentTetromino.rotate();
        if (checkCollision(currentTetromino.getX(), currentTetromino.getY())) {
            currentTetromino.rotateBack();
        }
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

        // Check if the game is over
        if (y < 0) {
            gameOver = true;
        }
    }

    public void clearLines() {
        int[][] board = gameBoard.getBoard();
        for (int i = 0; i < board.length; i++) {
            boolean lineComplete = true;
            for (int j = 0; j < board[i].length; j++) {
                if (board[i][j] == 0) {
                    lineComplete = false;
                    break;
                }
            }
            if (lineComplete) {
                for (int k = i; k > 0; k--) {
                    board[k] = board[k - 1];
                }
                board[0] = new int[board[0].length];
            }
        }
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
                    if (newX < 0 || newX >= gameBoard.getBoard()[0].length || newY >= gameBoard.getBoard().length) {
                        return true;
                    }
                    if (newY >= 0 && gameBoard.getBoard()[newY][newX] != 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public void restartGame() {
        gameBoard = new GameBoard();
        currentTetromino = new Tetromino();
        gameOver = false;
    }
}
