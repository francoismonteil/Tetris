// src/main/java/fr/asser/tetris/model/GameBoard.java
package fr.asser.tetris.model;

public class GameBoard {
    private int[][] board;
    private int rows;
    private int cols;
    private int score;
    private int level;
    private int linesCleared;

    // Constructor sans argument
    public GameBoard() {
        this.board = new int[20][10];
        this.score = 0;
        this.level = 1;
    }

    public GameBoard(int rows, int cols) {
        this.rows = rows;
        this.cols = cols;
        this.board = new int[rows][cols];
        this.score = 0;
        this.level = 1;
        this.linesCleared = 0;
    }

    public int[][] getBoard() {
        return board;
    }

    public int getScore() {
        return score;
    }

    public int getLevel() {
        return level;
    }

    public boolean canPlaceTetromino(Tetromino tetromino) {
        int[][] shape = tetromino.getShape();
        int x = tetromino.getX();
        int y = tetromino.getY();

        for (int i = 0; i < shape.length; i++) {
            for (int j = 0; j < shape[0].length; j++) {
                if (shape[i][j] != 0) {
                    int newX = x + j;
                    int newY = y + i;

                    if (newX < 0 || newX >= cols || newY < 0 || newY >= rows || board[newY][newX] != 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    public void placeTetromino(Tetromino tetromino) {
        int[][] shape = tetromino.getShape();
        int x = tetromino.getX();
        int y = tetromino.getY();

        for (int i = 0; i < shape.length; i++) {
            for (int j = 0; j < shape[0].length; j++) {
                if (shape[i][j] != 0) {
                    board[y + i][x + j] = shape[i][j];
                }
            }
        }
    }

    public void clearLines() {
        int linesClearedInThisStep = 0;
        for (int i = rows - 1; i >= 0; i--) {
            boolean fullLine = true;
            for (int j = 0; j < cols; j++) {
                if (board[i][j] == 0) {
                    fullLine = false;
                    break;
                }
            }
            if (fullLine) {
                for (int k = i; k > 0; k--) {
                    board[k] = board[k - 1];
                }
                board[0] = new int[cols];
                linesClearedInThisStep++;
                i++;
            }
        }

        if (linesClearedInThisStep > 0) {
            linesCleared += linesClearedInThisStep;
            score += calculateScore(linesClearedInThisStep);
            level = 1 + linesCleared / 10;
        }
    }

    private int calculateScore(int lines) {
        return switch (lines) {
            case 1 -> 100;
            case 2 -> 300;
            case 3 -> 500;
            case 4 -> 800;
            default -> 0;
        };
    }
}
