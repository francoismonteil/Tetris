// src/main/java/fr/asser/tetris/model/Tetromino.java
package fr.asser.tetris.model;

public class Tetromino {
    private int[][] shape;
    private int x;
    private int y;
    private String type;
    private int rotationIndex;

    private static final String[] TYPES = {"I", "J", "L", "O", "S", "T", "Z"};
    private static final int[][][] SHAPES = {
            {{1, 1, 1, 1}, {0, 0, 0, 0}, {0, 0, 0, 0}, {0, 0, 0, 0}},
            {{1, 0, 0}, {1, 1, 1}, {0, 0, 0}},
            {{0, 0, 1}, {1, 1, 1}, {0, 0, 0}},
            {{1, 1}, {1, 1}},
            {{0, 1, 1}, {1, 1, 0}, {0, 0, 0}},
            {{0, 1, 0}, {1, 1, 1}, {0, 0, 0}},
            {{1, 1, 0}, {0, 1, 1}, {0, 0, 0}}
    };

    private static final int INITIAL_X = 3;
    private static final int INITIAL_Y = 0;

    public Tetromino() {
        this.rotationIndex = 0;
        int typeIndex = (int) (Math.random() * SHAPES.length);
        this.shape = SHAPES[typeIndex];
        this.type = TYPES[typeIndex];
        this.x = INITIAL_X;
        this.y = INITIAL_Y;
    }

    public int[][] getShape() {
        return shape;
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    public String getType() {
        return type;
    }

    public void rotate() {
        shape = rotateMatrix(shape);
    }

    public void rotateBack() {
        shape = rotateMatrixCounterClockwise(shape);
    }

    private int[][] rotateMatrix(int[][] matrix) {
        int n = matrix.length;
        int[][] rotatedMatrix = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                rotatedMatrix[j][n - 1 - i] = matrix[i][j];
            }
        }
        return rotatedMatrix;
    }

    private int[][] rotateMatrixCounterClockwise(int[][] matrix) {
        int n = matrix.length;
        int[][] rotatedMatrix = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                rotatedMatrix[i][j] = matrix[j][n - 1 - i];
            }
        }
        return rotatedMatrix;
    }
}
