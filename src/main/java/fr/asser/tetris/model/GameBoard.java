package fr.asser.tetris.model;

public class GameBoard {
    private final int[][] board;
    private final int rows;
    private final int cols;
    private int score;
    private int level;
    private int linesCleared;

    public GameBoard() {
        this(20, 10);
    }

    public GameBoard(int rows, int cols) {
        this.rows = rows;
        this.cols = cols;
        this.board = new int[rows][cols];
        this.score = 0;
        this.level = 1;
        this.linesCleared = 0;
    }

    public GameBoard(int[][] board, int score, int level, int linesCleared) {
        this.rows = board.length;
        this.cols = board[0].length;
        this.board = board;
        this.score = score;
        this.level = level;
        this.linesCleared = linesCleared;
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

    public int getLinesCleared() {
        return linesCleared;
    }

    public boolean canPlaceTetromino(Tetromino tetromino) {
        for (int i = 0; i < tetromino.getShape().length; i++) {
            for (int j = 0; j < tetromino.getShape()[0].length; j++) {
                if (tetromino.getShape()[i][j] != 0) {
                    int newX = tetromino.getX() + j;
                    int newY = tetromino.getY() + i;
                    if (isOutOfBounds(newX, newY) || board[newY][newX] != 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    public void placeTetromino(Tetromino tetromino) {
        for (int i = 0; i < tetromino.getShape().length; i++) {
            for (int j = 0; j < tetromino.getShape()[0].length; j++) {
                if (tetromino.getShape()[i][j] != 0) {
                    board[tetromino.getY() + i][tetromino.getX() + j] = tetromino.getShape()[i][j];
                }
            }
        }
    }

    public void clearLines() {
        int clearedLines = 0;
        for (int i = rows - 1; i >= 0; i--) {
            if (isLineComplete(i)) {
                clearLine(i);
                clearedLines++;
                i++;
            }
        }
        updateScoreAndLevel(clearedLines);
    }

    private boolean isOutOfBounds(int x, int y) {
        return x < 0 || x >= cols || y < 0 || y >= rows;
    }

    private boolean isLineComplete(int row) {
        for (int j = 0; j < cols; j++) {
            if (board[row][j] == 0) {
                return false;
            }
        }
        return true;
    }

    private void clearLine(int row) {
        System.arraycopy(board, 0, board, 1, row);
        board[0] = new int[cols];
    }

    private void updateScoreAndLevel(int clearedLines) {
        if (clearedLines > 0) {
            linesCleared += clearedLines;
            score += calculateScore(clearedLines);
            level = score / 100 + 1;
        }
    }

    private int calculateScore(int lines) {
        return switch (lines) {
            case 1 -> 100;
            case 2 -> 300;
            case 3 -> 500;
            case 4 -> 800;
            default -> 0;
        } * level;
    }
}
