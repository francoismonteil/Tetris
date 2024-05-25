// src/main/java/fr/asser/tetris/model/Tetromino.java
package fr.asser.tetris.model;

public class Tetromino {
    private int[][] shape;
    private int x;
    private int y;
    private int rotationIndex;

    // Liste des rotations pour chaque type de tétrimino
    private static final int[][][] SHAPES = {
            // I
            {{1, 1, 1, 1}, {0, 0, 0, 0}, {0, 0, 0, 0}, {0, 0, 0, 0}},
            // J
            {{1, 0, 0}, {1, 1, 1}, {0, 0, 0}},
            // L
            {{0, 0, 1}, {1, 1, 1}, {0, 0, 0}},
            // O
            {{1, 1}, {1, 1}},
            // S
            {{0, 1, 1}, {1, 1, 0}, {0, 0, 0}},
            // T
            {{0, 1, 0}, {1, 1, 1}, {0, 0, 0}},
            // Z
            {{1, 1, 0}, {0, 1, 1}, {0, 0, 0}}};

    public Tetromino() {
        this.rotationIndex = 0;
        int type = (int) (Math.random() * SHAPES.length);
        this.shape = SHAPES[type];
        this.x = 3;
        this.y = 0;
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

    public void rotate() {
        int n = shape.length;
        int[][] rotatedShape = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                rotatedShape[j][n - 1 - i] = shape[i][j];
            }
        }
        shape = rotatedShape;
    }

    public void rotateBack() {
        int n = shape.length;
        int[][] rotatedShape = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                rotatedShape[i][j] = shape[j][n - 1 - i];
            }
        }
        shape = rotatedShape;
    }
}
